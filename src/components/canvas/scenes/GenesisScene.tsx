import { FC, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const GenesisScene: FC = () => {
  const crystalRef = useRef<THREE.Group>(null);
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Stardust particle field
  const particleCount = 200;
  const particles = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 15;
      pos[i + 1] = (Math.random() - 0.5) * 15;
      pos[i + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!crystalRef.current) return;

    // Fade out and scale up as user scrolls past Scene 01 (0.0 to 0.15)
    const t = THREE.MathUtils.clamp(scrollProgress / 0.15, 0, 1);
    const visible = scrollProgress < 0.20;
    crystalRef.current.visible = visible;

    if (visible) {
      crystalRef.current.rotation.y += delta * 0.4;
      crystalRef.current.rotation.z += delta * 0.2;
      crystalRef.current.scale.setScalar(1 + t * 2.0);
    }
  });

  return (
    <group ref={crystalRef}>
      {/* Floating central crystal monolith */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#2C115F"
            emissive="#DCB0FF"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.9}
            wireframe={false}
          />
        </mesh>
        {/* Outer wireframe aura */}
        <mesh scale={[1.25, 1.25, 1.25]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial color="#DCB0FF" wireframe opacity={0.35} transparent />
        </mesh>
      </Float>

      {/* Particle field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#DCB0FF" transparent opacity={0.6} />
      </points>
    </group>
  );
};
