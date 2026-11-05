import { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const EcosystemScene: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  const nodes = [
    { name: 'Pagelit', color: '#00E5FF', angle: 0 },
    { name: 'AR Explorer', color: '#38BDF8', angle: Math.PI / 2 },
    { name: 'The System', color: '#F59E0B', angle: Math.PI },
    { name: 'Battle Cows', color: '#10B981', angle: (3 * Math.PI) / 2 },
  ];

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Active range: 0.88 to 1.0
    const isVisible = scrollProgress >= 0.88;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15;
    }

    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.5;
      coreRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Studio Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#2C115F"
          emissive="#DCB0FF"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Primary Orbital Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[3.2, 3.25, 64]} />
        <meshBasicMaterial color="#DCB0FF" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>

      {/* Secondary Orbital Ring */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <ringGeometry args={[3.8, 3.84, 64]} />
        <meshBasicMaterial color="#00E5FF" side={THREE.DoubleSide} transparent opacity={0.25} />
      </mesh>

      {/* 4 Orbiting Product Planetary Nodes */}
      {nodes.map((node) => {
        const radius = 3.2;
        const x = Math.cos(node.angle) * radius;
        const z = Math.sin(node.angle) * radius;

        return (
          <group key={node.name} position={[x, 0, z]}>
            <mesh>
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={0.6}
                roughness={0.2}
              />
            </mesh>
            {/* Halo ring around node */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.45, 0.5, 32]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
