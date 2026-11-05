import { FC, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const BattleCowsScene: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const boardRef = useRef<THREE.Group>(null);
  const cowPawnRef = useRef<THREE.Group>(null);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Generate 25 hex pasture coordinates (axial coordinates in a compact cluster)
  const hexTiles = useMemo(() => {
    const tiles: { x: number; z: number; color: string; delay: number }[] = [];
    const colors = ['#10B981', '#059669', '#34D399', '#FBBF24', '#047857'];
    const radius = 2;

    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        const x = 1.35 * (q + r / 2);
        const z = 1.15 * r;
        const color = colors[Math.abs((q * 3 + r * 7)) % colors.length];
        const delay = (q + radius) * 0.1 + (r + radius) * 0.05;
        tiles.push({ x, z, color, delay });
      }
    }
    return tiles;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Active range: 0.72 to 0.94
    const isVisible = scrollProgress >= 0.70 && scrollProgress <= 0.96;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const localT = THREE.MathUtils.clamp((scrollProgress - 0.75) / 0.15, 0, 1);

    if (boardRef.current) {
      boardRef.current.rotation.y += delta * 0.1;
      // Staggered bouncy drop of board
      boardRef.current.position.y = THREE.MathUtils.lerp(-4, -0.6, localT);
    }

    if (cowPawnRef.current) {
      cowPawnRef.current.position.y = THREE.MathUtils.lerp(-2, 0.4, localT);
      cowPawnRef.current.rotation.y -= delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0.8, 0, 0]} rotation={[0.4, -0.3, 0]}>
      {/* Hexagonal Pasture Grid */}
      <group ref={boardRef} position={[0, -0.6, 0]}>
        {hexTiles.map((tile, i) => (
          <mesh
            key={i}
            position={[tile.x, 0, tile.z]}
            castShadow
            receiveShadow
          >
            {/* 6-sided cylinder = 3D Hexagon */}
            <cylinderGeometry args={[0.72, 0.72, 0.22, 6]} />
            <meshStandardMaterial
              color={tile.color}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Hero Cow Token Piece */}
      <group ref={cowPawnRef} position={[0, 0.4, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          {/* Cow Body */}
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.6, 1.1]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Cow Head */}
          <mesh position={[0, 0.35, 0.6]} castShadow>
            <boxGeometry args={[0.55, 0.5, 0.5]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Cow Muzzle */}
          <mesh position={[0, 0.22, 0.88]}>
            <boxGeometry args={[0.4, 0.24, 0.2]} />
            <meshStandardMaterial color="#F472B6" roughness={0.5} />
          </mesh>
          {/* Horns */}
          <mesh position={[-0.22, 0.65, 0.6]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.04, 0.08, 0.25, 8]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.6} />
          </mesh>
          <mesh position={[0.22, 0.65, 0.6]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.04, 0.08, 0.25, 8]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.6} />
          </mesh>
          {/* Spot Accent */}
          <mesh position={[0.3, 0.31, 0.1]}>
            <boxGeometry args={[0.25, 0.02, 0.4]} />
            <meshBasicMaterial color="#1F2937" />
          </mesh>
        </Float>
      </group>
    </group>
  );
};
