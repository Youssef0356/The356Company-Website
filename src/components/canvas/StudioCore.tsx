import { FC, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { GaussianSplatObject } from './GaussianSplatObject';

// Preload the Studio Core 3D model
useGLTF.preload('/models/studio_core.glb');

export const StudioCore: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const medallionRef = useRef<THREE.Object3D | null>(null);
  const initialMedallionQuat = useRef<THREE.Quaternion | null>(null);
  const ringsRef = useRef<THREE.Object3D | null>(null);
  const floatingGroupRef = useRef<THREE.Object3D | null>(null);
  const phoneRef = useRef<THREE.Object3D | null>(null);

  // Dynamic light refs for silhouette -> lit awakening
  const spotKeyRef = useRef<THREE.SpotLight>(null);
  const spotRimRightRef = useRef<THREE.SpotLight>(null);
  const spotRimLeftRef = useRef<THREE.SpotLight>(null);
  const pointAbyssRef = useRef<THREE.PointLight>(null);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Load the Studio Core GLB
  const { scene } = useGLTF('/models/studio_core.glb');

  // Clone scene & configure references
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (child.name === 'Monogram_Medallion') {
        medallionRef.current = child;
        initialMedallionQuat.current = child.quaternion.clone();
      } else if (child.name === 'Orbital_Rings_Group') {
        ringsRef.current = child;
      } else if (
        child.name === 'Floating_Elements_Group' ||
        child.name === 'Satellites_Group'
      ) {
        floatingGroupRef.current = child;
      } else if (
        child.name.includes('Laptop') ||
        child.name === 'Sketchfab_model.001'
      ) {
        // Hide original static laptop mesh so authentic Gaussian Splats take its place
        child.visible = false;
      } else if (
        child.name.includes('Phone') ||
        child.name === 'Sketchfab_model'
      ) {
        phoneRef.current = child;
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.needsUpdate = true;
          if (mat.roughness !== undefined) {
            mat.roughness = Math.max(0.18, mat.roughness);
          }
          if (mat.metalness !== undefined) {
            mat.metalness = Math.min(0.92, mat.metalness);
          }
        }
      }
    });

    return cloned;
  }, [scene]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;
    const p = Math.min(1.0, Math.max(0.0, scrollProgress));

    // ==========================================
    // 1. CHOREOGRAPHED STUDIO LIGHTING (SILHOUETTE -> LIT AWAKENING)
    // ==========================================
    const lightT = Math.min(1.0, Math.max(0.0, (p - 0.03) / 0.28));
    const easedLight = THREE.MathUtils.smoothstep(lightT, 0.0, 1.0);

    if (spotKeyRef.current) {
      spotKeyRef.current.intensity = THREE.MathUtils.lerp(0.04, 2.2, easedLight);
    }
    if (spotRimRightRef.current) {
      spotRimRightRef.current.intensity = THREE.MathUtils.lerp(0.02, 2.8, easedLight);
    }
    if (spotRimLeftRef.current) {
      spotRimLeftRef.current.intensity = THREE.MathUtils.lerp(0.02, 2.4, easedLight);
    }
    if (pointAbyssRef.current) {
      pointAbyssRef.current.intensity = THREE.MathUtils.lerp(0.0, 1.2, easedLight);
    }

    // ==========================================
    // 2. SUBTLE ZERO-GRAVITY BREATHING & POINTER PARALLAX
    // ==========================================
    if (groupRef.current) {
      const floatY = Math.sin(time * 0.7) * 0.06;
      groupRef.current.position.y = floatY;

      const targetRotX = pointer.y * 0.06;
      const targetRotY = pointer.x * 0.10;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        delta * 2.5
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        delta * 2.5
      );
    }

    // ==========================================
    // 3. 180° MEDALLION COIN FLIP MECHANIC
    // ==========================================
    if (medallionRef.current && initialMedallionQuat.current) {
      const flipProgress = Math.min(1.0, Math.max(0.0, (p - 0.04) / 0.32));
      const easedFlip = THREE.MathUtils.smoothstep(flipProgress, 0.0, 1.0);
      const flipAngle = (1.0 - easedFlip) * Math.PI;

      medallionRef.current.quaternion.copy(initialMedallionQuat.current);
      medallionRef.current.rotateY(flipAngle);
    }

    // ==========================================
    // 4. FLOATING SATELLITES & BADGES APPEARANCE
    // ==========================================
    if (floatingGroupRef.current) {
      const appearProgress = Math.min(1.0, Math.max(0.0, (p - 0.06) / 0.28));
      const easedAppear = THREE.MathUtils.smoothstep(appearProgress, 0.0, 1.0);

      floatingGroupRef.current.scale.setScalar(Math.max(0.0001, easedAppear));
      floatingGroupRef.current.position.z = (1.0 - easedAppear) * 4.0;
    }

    // ==========================================
    // 5. ORBITAL RINGS ACCELERATION WITH SCROLL
    // ==========================================
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.2 + p * 0.5;
      ringsRef.current.rotation.x = Math.sin(time * 0.5) * 0.2 + p * Math.PI * 2.0;
    }

    // ==========================================
    // 6. PHONE ROTATION
    // ==========================================
    if (phoneRef.current) {
      phoneRef.current.position.y = -0.2 + Math.cos(time * 0.85 + 2.0) * 0.08;
      phoneRef.current.rotation.y -= delta * 0.1;
    }
  });

  // Calculate Gaussian Splat Gathering & Dispersion Progress
  // p < 0.15: Laptop hidden / dispersed cloud (progress = 1.0)
  // p in [0.15, 0.45]: Camera sweeps to laptop -> Splats gather together (1.0 -> 0.0)
  // p in [0.45, 0.65]: Laptop is fully assembled, solid, and pristine (progress = 0.0)
  // p in [0.65, 0.85]: Splats gently disperse outward again (0.0 -> 1.0)
  const p = Math.min(1.0, Math.max(0.0, scrollProgress));
  let splatProgress = 1.0;
  if (p < 0.15) {
    splatProgress = 1.0;
  } else if (p <= 0.45) {
    splatProgress = 1.0 - (p - 0.15) / 0.30;
  } else if (p <= 0.65) {
    splatProgress = 0.0;
  } else if (p <= 0.85) {
    splatProgress = (p - 0.65) / 0.20;
  } else {
    splatProgress = 1.0;
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.05}>
      <primitive object={clonedScene} />

      {/* 3D GAUSSIAN SPLATTING LAPTOP (70,000 True Gaussian Ellipsoids) */}
      <GaussianSplatObject
        splatUrl="/models/laptop_gaussian.ply"
        progress={splatProgress}
        scatterRadius={3.6}
        position={[0, 0, 0]}
        scale={1.0}
      />

      {/* Chiaroscuro Studio Lighting with Dynamic Silhouette Transition */}
      <spotLight
        ref={spotKeyRef}
        position={[0, 4.5, 4.0]}
        intensity={0.04}
        angle={0.55}
        penumbra={0.7}
        color="#FFFFFF"
      />
      <spotLight
        ref={spotRimRightRef}
        position={[5.5, -1, 3.5]}
        intensity={0.02}
        angle={0.45}
        penumbra={0.5}
        color="#DCB0FF"
      />
      <spotLight
        ref={spotRimLeftRef}
        position={[-5.5, 2.5, 3.0]}
        intensity={0.02}
        angle={0.45}
        penumbra={0.6}
        color="#8C3BE2"
      />
      <pointLight
        ref={pointAbyssRef}
        position={[0, -3.5, -2.5]}
        intensity={0.0}
        color="#00E5FF"
      />
    </group>
  );
};
