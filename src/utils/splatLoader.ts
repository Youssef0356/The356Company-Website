import * as THREE from 'three';

export interface SplatCloudData {
  count: number;
  positions: Float32Array;
  scales: Float32Array;
  rotations: Float32Array;
  colors: Float32Array;
  scatterDirs: Float32Array;
  phases: Float32Array;
}

const SH_C0 = 0.28209479177387814;

/**
 * High-performance binary 3D Gaussian Splat PLY parser
 */
export async function loadGaussianSplatPly(url: string): Promise<SplatCloudData> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  const textDecoder = new TextDecoder('ascii');
  const headerText = textDecoder.decode(new Uint8Array(arrayBuffer, 0, 2048));

  const endHeaderToken = 'end_header\n';
  const endHeaderIdx = headerText.indexOf(endHeaderToken);
  if (endHeaderIdx === -1) {
    throw new Error('Invalid Gaussian Splat PLY: end_header not found');
  }

  const binaryOffset = endHeaderIdx + endHeaderToken.length;
  const byteLength = arrayBuffer.byteLength - binaryOffset;
  const stride = 68; // 17 float32 fields = 68 bytes per splat
  const count = Math.floor(byteLength / stride);

  const dv = new DataView(arrayBuffer, binaryOffset);

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count * 3);
  const rotations = new Float32Array(count * 4);
  const colors = new Float32Array(count * 4);
  const scatterDirs = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  const tempScatter = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const offset = i * stride;

    // 1. Position (x, y, z)
    const px = dv.getFloat32(offset, true);
    const py = dv.getFloat32(offset + 4, true);
    const pz = dv.getFloat32(offset + 8, true);

    positions[i * 3] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = pz;

    // 2. Color (f_dc_0, f_dc_1, f_dc_2) + Opacity
    const f_dc_0 = dv.getFloat32(offset + 24, true);
    const f_dc_1 = dv.getFloat32(offset + 28, true);
    const f_dc_2 = dv.getFloat32(offset + 32, true);
    const rawOpacity = dv.getFloat32(offset + 36, true);

    const r = Math.min(1.0, Math.max(0.0, 0.5 + SH_C0 * f_dc_0));
    const g = Math.min(1.0, Math.max(0.0, 0.5 + SH_C0 * f_dc_1));
    const b = Math.min(1.0, Math.max(0.0, 0.5 + SH_C0 * f_dc_2));
    const alpha = 1.0 / (1.0 + Math.exp(-rawOpacity));

    colors[i * 4] = r;
    colors[i * 4 + 1] = g;
    colors[i * 4 + 2] = b;
    colors[i * 4 + 3] = alpha;

    // 3. Log-Scales (scale_0, scale_1, scale_2) -> convert from log to linear
    const s0 = Math.exp(dv.getFloat32(offset + 40, true));
    const s1 = Math.exp(dv.getFloat32(offset + 44, true));
    const s2 = Math.exp(dv.getFloat32(offset + 48, true));

    scales[i * 3] = s0;
    scales[i * 3 + 1] = s1;
    scales[i * 3 + 2] = s2;

    // 4. Rotation Quaternion (w, x, y, z)
    const qw = dv.getFloat32(offset + 52, true);
    const qx = dv.getFloat32(offset + 56, true);
    const qy = dv.getFloat32(offset + 60, true);
    const qz = dv.getFloat32(offset + 64, true);

    rotations[i * 4] = qx;
    rotations[i * 4 + 1] = qy;
    rotations[i * 4 + 2] = qz;
    rotations[i * 4 + 3] = qw;

    // 5. Procedural Organic Scatter Trajectory
    // Scatter tightly around the laptop, strictly biased to the left (-X) and back (-Z)
    // so it NEVER crosses over toward the center medallion!
    const angle = (i / count) * Math.PI * 14.0;
    const scatterX = -Math.abs(Math.cos(angle)) * (0.6 + Math.random() * 0.8) - 0.2;
    const scatterY = (Math.random() - 0.5) * 1.2;
    const scatterZ = Math.sin(angle) * 0.8 + (Math.random() - 0.5) * 0.6;

    tempScatter.set(scatterX, scatterY, scatterZ).normalize();

    scatterDirs[i * 3] = tempScatter.x;
    scatterDirs[i * 3 + 1] = tempScatter.y;
    scatterDirs[i * 3 + 2] = tempScatter.z;

    // 6. Stagger Phase [0.0, 1.0] for ripple wave assembly
    phases[i] = Math.random();
  }

  return {
    count,
    positions,
    scales,
    rotations,
    colors,
    scatterDirs,
    phases,
  };
}
