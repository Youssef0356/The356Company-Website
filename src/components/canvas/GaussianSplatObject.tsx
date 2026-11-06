import { FC, useEffect, useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { loadGaussianSplatPly, SplatCloudData } from '@/utils/splatLoader';

interface GaussianSplatObjectProps {
  splatUrl: string;
  progress: number; // 0.0 = solid assembled, 1.0 = fully dispersed cloud
  scatterRadius?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const GaussianSplatObject: FC<GaussianSplatObjectProps> = ({
  splatUrl,
  progress,
  scatterRadius = 3.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}) => {
  const { size } = useThree();
  const [splatData, setSplatData] = useState<SplatCloudData | null>(null);

  const meshRef = useRef<THREE.Mesh>(null);

  // Load the 3D Gaussian Splat PLY
  useEffect(() => {
    let isCancelled = false;
    loadGaussianSplatPly(splatUrl)
      .then((data) => {
        if (!isCancelled) {
          setSplatData(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load Gaussian Splat PLY:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [splatUrl]);

  // Base Quad Geometry for Instanced Gaussian Splats
  const baseGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // 2D Quad in [-1, 1] bounds
    const vertices = new Float32Array([
      -1, -1, 0,
       1, -1, 0,
       1,  1, 0,
      -1, -1, 0,
       1,  1, 0,
      -1,  1, 0,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geo;
  }, []);

  // Configure Instanced Attributes when splat data arrives
  const instancedGeometry = useMemo(() => {
    if (!splatData) return null;

    const geo = new THREE.InstancedBufferGeometry();
    geo.index = baseGeometry.index;
    geo.attributes.position = baseGeometry.attributes.position;

    geo.setAttribute(
      'aPosition',
      new THREE.InstancedBufferAttribute(splatData.positions, 3)
    );
    geo.setAttribute(
      'aScale',
      new THREE.InstancedBufferAttribute(splatData.scales, 3)
    );
    geo.setAttribute(
      'aQuat',
      new THREE.InstancedBufferAttribute(splatData.rotations, 4)
    );
    geo.setAttribute(
      'aColor',
      new THREE.InstancedBufferAttribute(splatData.colors, 4)
    );
    geo.setAttribute(
      'aScatterDir',
      new THREE.InstancedBufferAttribute(splatData.scatterDirs, 3)
    );
    geo.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(splatData.phases, 1)
    );

    return geo;
  }, [splatData, baseGeometry]);

  // Custom 3D Gaussian Splatting Shader Material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      uniforms: {
        uProgress: { value: 0.0 },
        uScatterRadius: { value: scatterRadius },
        uTime: { value: 0.0 },
        uFocal: { value: new THREE.Vector2(1000, 1000) },
        uViewport: { value: new THREE.Vector2(size.width, size.height) },
      },
      vertexShader: `
        precision highp float;

        attribute vec3 aPosition;
        attribute vec3 aScale;
        attribute vec4 aQuat;
        attribute vec4 aColor;
        attribute vec3 aScatterDir;
        attribute float aPhase;

        uniform float uProgress;
        uniform float uScatterRadius;
        uniform float uTime;
        uniform vec2 uFocal;
        uniform vec2 uViewport;

        varying vec4 vColor;
        varying vec2 vQuadCoord;
        varying mat2 vInvCov2D;

        // Quaternion to rotation matrix
        mat3 quatToMat3(vec4 q) {
          float x2 = q.x + q.x, y2 = q.y + q.y, z2 = q.z + q.z;
          float xx = q.x * x2,  xy = q.x * y2,  xz = q.x * z2;
          float yy = q.y * y2,  yz = q.y * z2,  zz = q.z * z2;
          float wx = q.w * x2,  wy = q.w * y2,  wz = q.w * z2;

          return mat3(
            1.0 - (yy + zz), xy + wz,        xz - wy,
            xy - wz,        1.0 - (xx + zz), yz + wx,
            xz + wy,        yz - wx,        1.0 - (xx + yy)
          );
        }

        void main() {
          // Staggered ripple dispersion and gathering
          float localProgress = clamp((uProgress - aPhase * 0.35) / 0.65, 0.0, 1.0);
          float easedProgress = smoothstep(0.0, 1.0, localProgress);

          // Displaced 3D Position
          vec3 dynamicPos = aPosition + aScatterDir * (easedProgress * uScatterRadius);
          
          // Zero-gravity harmonic turbulence during dispersion
          dynamicPos += vec3(
            sin(uTime * 1.4 + dynamicPos.y * 2.5) * 0.06 * easedProgress,
            cos(uTime * 1.1 + dynamicPos.x * 2.5) * 0.06 * easedProgress,
            sin(uTime * 1.6 + dynamicPos.z * 2.5) * 0.06 * easedProgress
          );

          // World and View transform
          vec4 worldPos = modelMatrix * vec4(dynamicPos, 1.0);
          vec4 viewPos = viewMatrix * worldPos;

          // Compute 3D Covariance: Sigma = R * S * S^T * R^T
          mat3 R = quatToMat3(aQuat);
          // Scale swells slightly when floating dispersed for visual softness
          vec3 s = aScale * (1.0 + easedProgress * 0.85);
          mat3 S = mat3(
            s.x, 0.0, 0.0,
            0.0, s.y, 0.0,
            0.0, 0.0, s.z
          );
          mat3 M = R * S;
          mat3 Sigma3D = M * transpose(M);

          // View-space covariance: Sigma_v = V * Sigma3D * V^T
          mat3 V = mat3(viewMatrix);
          mat3 SigmaV = V * Sigma3D * transpose(V);

          // Project to 2D Screen-space Covariance using Jacobian J
          float z = -viewPos.z;
          float fx = uFocal.x;
          float fy = uFocal.y;

          mat3 J = mat3(
            fx / z, 0.0, -(fx * viewPos.x) / (z * z),
            0.0, fy / z, -(fy * viewPos.y) / (z * z),
            0.0, 0.0, 0.0
          );

          mat3 cov2D_3 = J * SigmaV * transpose(J);
          mat2 cov2D = mat2(
            cov2D_3[0][0] + 0.3, cov2D_3[0][1],
            cov2D_3[1][0], cov2D_3[1][1] + 0.3
          );

          // Eigenvalues of 2D Covariance
          float a = cov2D[0][0];
          float b = cov2D[0][1];
          float c = cov2D[1][1];

          float trace = a + c;
          float det = a * c - b * b;
          float term = sqrt(max(0.01, (trace * trace * 0.25) - det));
          float lambda1 = trace * 0.5 + term;
          float lambda2 = max(0.01, trace * 0.5 - term);

          // Eigenvector for orientation
          vec2 axis1 = vec2(b, lambda1 - a);
          if (length(axis1) < 0.0001) axis1 = vec2(1.0, 0.0);
          axis1 = normalize(axis1);
          vec2 axis2 = vec2(-axis1.y, axis1.x);

          // Radii along ellipse principal axes (3-sigma extent)
          float r1 = min(64.0, 3.0 * sqrt(max(0.1, lambda1)));
          float r2 = min(64.0, 3.0 * sqrt(max(0.1, lambda2)));

          // Inverse 2D Covariance for Gaussian evaluation in fragment shader
          float invDet = 1.0 / max(0.0001, det);
          vInvCov2D = mat2(c * invDet, -b * invDet, -b * invDet, a * invDet);

          // Screen offset
          vec2 offset = position.x * axis1 * r1 + position.y * axis2 * r2;
          vQuadCoord = position.xy * 3.0; // [-3, 3] domain

          vec4 clipPos = projectionMatrix * viewPos;
          clipPos.xy += (offset / uViewport) * 2.0 * clipPos.w;

          gl_Position = clipPos;
          vColor = aColor;
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec4 vColor;
        varying vec2 vQuadCoord;
        varying mat2 vInvCov2D;

        void main() {
          // Exact 2D Gaussian Ellipsoid Evaluation: G(x, y) = exp(-0.5 * x^T * Sigma^-1 * x)
          float power = -0.5 * dot(vQuadCoord, vQuadCoord);

          if (power < -4.5) {
            discard;
          }

          float alpha = exp(power) * vColor.a;

          if (alpha < 0.02) {
            discard;
          }

          // Output pure Gaussian Splat color with soft volumetric falloff
          gl_FragColor = vec4(vColor.rgb, alpha);
        }
      `,
    });
  }, [baseGeometry, scatterRadius, size]);

  useFrame((state) => {
    if (!material) return;

    const time = state.clock.getElapsedTime();
    const camera = state.camera as THREE.PerspectiveCamera;

    // Calculate vertical and horizontal focal lengths in pixels
    const fovRad = (camera.fov * Math.PI) / 180.0;
    const fy = (size.height * 0.5) / Math.tan(fovRad * 0.5);
    const fx = fy * (camera.aspect || 1.0);

    material.uniforms.uFocal.value.set(fx, fy);
    material.uniforms.uViewport.value.set(size.width, size.height);
    material.uniforms.uTime.value = time;

    // Smoothly update dispersion progress uniform
    material.uniforms.uProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uProgress.value,
      progress,
      0.15
    );
  });

  if (!instancedGeometry) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        ref={meshRef}
        geometry={instancedGeometry}
        material={material}
        frustumCulled={false}
      />
    </group>
  );
};
