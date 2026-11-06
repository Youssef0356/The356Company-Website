import { FC, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { FractureCluster } from './FractureCluster';

// Preload the Studio Core 3D model
useGLTF.preload('/models/studio_core.glb');

export const StudioCore: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const medallionRef = useRef<THREE.Object3D | null>(null);
  const initialMedallionQuat = useRef<THREE.Quaternion | null>(null);
  const ringsRef = useRef<THREE.Object3D | null>(null);
  const floatingGroupRef = useRef<THREE.Object3D | null>(null);
  const laptopRef = useRef<THREE.Object3D | null>(null);
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
        laptopRef.current = child;
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
    // Normalized global scroll progress 0.0 to 1.0
    const p = Math.min(1.0, Math.max(0.0, scrollProgress));

    // ==========================================
    // 1. CHOREOGRAPHED STUDIO LIGHTING (SILHOUETTE -> LIT AWAKENING)
    // At p = 0: Key lights are near-zero (silhouette against space)
    // As p goes 0.05 -> 0.32: Studio illumination powers up to full PBR
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
    // At p = 0: Flipped backwards 180° (back plate faces viewer)
    // As p goes 0.05 -> 0.35: Flips smoothly to 0.0 (front logo faces viewer)
    // ==========================================
    if (medallionRef.current && initialMedallionQuat.current) {
      const flipProgress = Math.min(1.0, Math.max(0.0, (p - 0.04) / 0.32));
      const easedFlip = THREE.MathUtils.smoothstep(flipProgress, 0.0, 1.0);
      const flipAngle = (1.0 - easedFlip) * Math.PI;

      // Reset to original orientation and rotate around local Y axis
      medallionRef.current.quaternion.copy(initialMedallionQuat.current);
      medallionRef.current.rotateY(flipAngle);
    }

    // ==========================================
    // 4. FLOATING SATELLITES & BADGES APPEARANCE
    // At p = 0: Scale = 0 (hidden)
    // As p goes 0.08 -> 0.35: Scales up to 1.0 and flies inward into orbit
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
    // 6. FOCAL ANIMATION FOR LAPTOP & MOBILE PHONE
    // ==========================================
    if (laptopRef.current) {
      // Idle floating
      const idleY = Math.sin(time * 0.9 + 1.0) * 0.08;
      
      // When camera locks on during Phase 3 (p: 0.55 -> 0.85):
      // Element responds with mechanical floating agitation
      if (p >= 0.55 && p <= 0.88) {
        const agitateT = (p - 0.55) / 0.30;
        laptopRef.current.position.y = 0.2 + idleY + agitateT * 0.35;
        laptopRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.45, agitateT);
        laptopRef.current.rotation.z = Math.sin(time * 25) * agitateT * 0.05;
      } else {
        laptopRef.current.position.y = 0.2 + idleY;
        laptopRef.current.rotation.y += delta * 0.08;
        laptopRef.current.rotation.z = 0;
      }
    }

    if (phoneRef.current) {
      phoneRef.current.position.y = -0.2 + Math.cos(time * 0.85 + 2.0) * 0.08;
      phoneRef.current.rotation.y -= delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.05}>
      <primitive object={clonedScene} />

      {/* Dynamic Voronoi Fracture Cluster for Phase 3 Disassembly & Fly-Through Wipe */}
      <FractureCluster focalPoint={[-3.1, 0.1, 0.4]} />

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
