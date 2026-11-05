import { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const PagelitScene: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const bookRef = useRef<THREE.Group>(null);
  const pagesRef = useRef<THREE.Group>(null);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  const ribbonColors = ['#FACC15', '#4ADE80', '#00E5FF', '#F472B6', '#FB923C', '#60A5FA', '#DCB0FF'];

  useFrame((state) => {
    if (!groupRef.current) return;

    // Active range: 0.32 to 0.58
    const isVisible = scrollProgress >= 0.30 && scrollProgress <= 0.60;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const localT = THREE.MathUtils.clamp((scrollProgress - 0.35) / 0.20, 0, 1);
    const time = state.clock.getElapsedTime();

    if (bookRef.current) {
      bookRef.current.position.set(
        THREE.MathUtils.lerp(1.5, 1.2, localT),
        THREE.MathUtils.lerp(-0.2, 0.1, localT),
        THREE.MathUtils.lerp(0.5, 1.5, localT)
      );
      bookRef.current.rotation.y = THREE.MathUtils.lerp(-0.6, -0.2, localT);
    }

    // Flutter pages gently like turning leaves
    if (pagesRef.current) {
      pagesRef.current.children.forEach((page, i) => {
        const offset = i * 0.15;
        page.rotation.y = THREE.MathUtils.lerp(
          -0.1 * i,
          -0.4 * i + Math.sin(time * 2 + offset) * 0.05,
          localT
        );
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={bookRef}>
          {/* Book Spine / Cover */}
          <mesh position={[-0.9, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 2.6, 0.4]} />
            <meshStandardMaterial color="#2C115F" roughness={0.4} metalness={0.7} />
          </mesh>

          {/* Unfolding Translucent Document Leaves */}
          <group ref={pagesRef} position={[-0.85, 0, 0]}>
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh key={i} position={[0.8, 0, (i - 2) * 0.05]} castShadow>
                <planeGeometry args={[1.6, 2.4]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  roughness={0.5}
                  metalness={0.05}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            ))}
          </group>

          {/* Luminous Annotation Ribbons */}
          {ribbonColors.map((color, idx) => (
            <mesh
              key={color}
              position={[0.2, 1.1 - idx * 0.35, 0.15]}
              rotation={[0, 0, -0.05 * idx]}
            >
              <planeGeometry args={[0.9, 0.06]} />
              <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.9} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
};
