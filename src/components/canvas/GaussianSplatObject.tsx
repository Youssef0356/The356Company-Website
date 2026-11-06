import { FC, useEffect, useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { loadGaussianSplatPly, SplatCloudData } from '@/utils/splatLoader';

interface GaussianSplatObjectProps {
  splatUrl: string;
  progress: number; // 0.0 = solid assembled, 1.0 = fully dispersed cloud
  opacity?: number;  // Master opacity 0.0 to 1.0
  scatterRadius?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const GaussianSplatObject: FC<GaussianSplatObjectProps> = ({
  splatUrl,
  progress,
  opacity = 1.0,
  scatterRadius = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}) => {
  const { size } = useThree();
  const [splatData, setSplatData] = useState<SplatCloudData | null>(null);

  const groupRef = useRef<THREE.Group>(null);
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

  // Custom Smooth Gaussian Splatting Shader Material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending, // Additive blending prevents gritty dark fringes and creates silky glow
      uniforms: {
        uProgress: { value: 0.0 },
        uOpacity: { value: 0.0 },
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
        uniform float uOpacity;
        uniform float uScatterRadius;
        uniform float uTime;
        uniform vec2 uFocal;
        uniform vec2 uViewport;

        varying vec4 vColor;
        varying vec2 vQuadCoord;

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
          // Organic staggered wave
          float localProgress = clamp((uProgress - aPhase * 0.35) / 0.65, 0.0, 1.0);
          float easedProgress = smoothstep(0.0, 1.0, localProgress);

          // Displaced 3D Position
          vec3 dynamicPos = aPosition + aScatterDir * (easedProgress * uScatterRadius);
          
          // Harmonic zero-G micro-float
          dynamicPos += vec3(
            sin(uTime * 1.5 + dynamicPos.y * 3.0) * 0.03 * easedProgress,
            cos(uTime * 1.2 + dynamicPos.x * 3.0) * 0.03 * easedProgress,
            sin(uTime * 1.7 + dynamicPos.z * 3.0) * 0.03 * easedProgress
          );

          // World and View transform
          vec4 worldPos = modelMatrix * vec4(dynamicPos, 1.0);
          vec4 viewPos = viewMatrix * worldPos;

          // 3D Gaussian Covariance
          mat3 R = quatToMat3(aQuat);
          vec3 s = aScale * (1.0 + easedProgress * 0.3);
          mat3 S = mat3(
            s.x, 0.0, 0.0,
            0.0, s.y, 0.0,
            0.0, 0.0, s.z
          );
          mat3 M = R * S;
          mat3 Sigma3D = M * transpose(M);

          mat3 V = mat3(viewMatrix);
          mat3 SigmaV = V * Sigma3D * transpose(V);

          // Perspective Jacobian J
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
            cov2D_3[0][0] + 0.15, cov2D_3[0][1],
            cov2D_3[1][0], cov2D_3[1][1] + 0.15
          );

          float a = cov2D[0][0];
          float b = cov2D[0][1];
          float c = cov2D[1][1];

          float trace = a + c;
          float det = a * c - b * b;
          float term = sqrt(max(0.001, (trace * trace * 0.25) - det));
          float lambda1 = trace * 0.5 + term;
          float lambda2 = max(0.001, trace * 0.5 - term);

          vec2 axis1 = vec2(b, lambda1 - a);
          if (length(axis1) < 0.0001) axis1 = vec2(1.0, 0.0);
          axis1 = normalize(axis1);
          vec2 axis2 = vec2(-axis1.y, axis1.x);

          // Tight, soft radius
          float r1 = clamp(2.5 * sqrt(max(0.01, lambda1)), 1.2, 8.0);
          float r2 = clamp(2.5 * sqrt(max(0.01, lambda2)), 1.2, 8.0);

          vec2 offset = position.x * axis1 * r1 + position.y * axis2 * r2;
          vQuadCoord = position.xy; // in [-1, 1]

          vec4 clipPos = projectionMatrix * viewPos;
          clipPos.xy += (offset / uViewport) * 2.0 * clipPos.w;

          gl_Position = clipPos;
          vColor = aColor;
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uOpacity;

        varying vec4 vColor;
        varying vec2 vQuadCoord;

        void main() {
          if (uOpacity < 0.005) {
            discard;
          }

          // Smooth exponential Gaussian bell curve
          float r2 = dot(vQuadCoord, vQuadCoord);
          float gaussian = exp(-2.8 * r2);

          if (gaussian < 0.015) {
            discard;
          }

          float alpha = gaussian * vColor.a * uOpacity * 0.55;

          // Silky iridescent cyan/purple luminous tint
          vec3 glowingColor = mix(vColor.rgb, vec3(0.75, 0.85, 1.0), 0.25);

          gl_FragColor = vec4(glowingColor * alpha, alpha);
        }
      `,
    });
  }, [baseGeometry, scatterRadius, size]);

  useFrame((state) => {
    if (!material) return;

    if (groupRef.current) {
      groupRef.current.visible = opacity > 0.005;
    }

    const time = state.clock.getElapsedTime();
    const camera = state.camera as THREE.PerspectiveCamera;

    const fovRad = (camera.fov * Math.PI) / 180.0;
    const fy = (size.height * 0.5) / Math.tan(fovRad * 0.5);
    const fx = fy * (camera.aspect || 1.0);

    material.uniforms.uFocal.value.set(fx, fy);
    material.uniforms.uViewport.value.set(size.width, size.height);
    material.uniforms.uTime.value = time;

    material.uniforms.uProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uProgress.value,
      progress,
      0.2
    );
    material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      material.uniforms.uOpacity.value,
      opacity,
      0.25
    );
  });

  if (!instancedGeometry) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} visible={false}>
      <mesh
        ref={meshRef}
        geometry={instancedGeometry}
        material={material}
        frustumCulled={false}
      />
    </group>
  );
};
