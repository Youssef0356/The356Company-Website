import { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const ARExplorerScene: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const phoneRef = useRef<THREE.Group>(null);
  const floorGridRef = useRef<THREE.Mesh>(null);
  const holoModelRef = useRef<THREE.Mesh>(null);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Active range: 0.12 to 0.38
    const isVisible = scrollProgress >= 0.10 && scrollProgress <= 0.40;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const localT = THREE.MathUtils.clamp((scrollProgress - 0.15) / 0.20, 0, 1);

    // Phone rotation from dramatic AR scan angle to face-on presentation
    if (phoneRef.current) {
      phoneRef.current.rotation.x = THREE.MathUtils.lerp(0.5, 0.05, localT);
      phoneRef.current.rotation.y = THREE.MathUtils.lerp(-0.6, 0.0, localT);
      phoneRef.current.position.set(
        THREE.MathUtils.lerp(-1.0, -1.2, localT),
        THREE.MathUtils.lerp(0.8, 0.2, localT),
        THREE.MathUtils.lerp(1.5, 2.0, localT)
      );
    }

    // Floor laser plane pulse
    if (floorGridRef.current) {
      const mat = floorGridRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.getElapsedTime() * 3) * 0.15;
    }

    // Holographic model rotation
    if (holoModelRef.current) {
      holoModelRef.current.rotation.y += delta * 0.8;
      holoModelRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 3D Phone Chassis */}
      <group ref={phoneRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          {/* Phone Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 2.8, 0.12]} />
            <meshStandardMaterial color="#0E1626" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Phone Glass Screen */}
          <mesh position={[0, 0, 0.065]}>
            <planeGeometry args={[1.32, 2.7]} />
            <meshStandardMaterial
              color="#0A192F"
              emissive="#38BDF8"
              emissiveIntensity={0.4}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>
          {/* Screen Camera Laser Ray Projector */}
          <pointLight position={[0, -1.2, 0.2]} color="#00E5FF" intensity={2} distance={3} />
        </Float>
      </group>

      {/* Spatial Scanning Floor Plane (Anchored to Floor) */}
      <mesh ref={floorGridRef} position={[0.8, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 2.2, 32]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Holographic 3D Mechanical Model Anchored in Spatial Floor */}
      <mesh ref={holoModelRef} position={[0.8, -0.6, 0]}>
        <torusKnotGeometry args={[0.55, 0.16, 96, 16]} />
        <meshStandardMaterial
          color="#2563EB"
          emissive="#38BDF8"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
    </group>
  );
};
