import { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const TheSystemScene: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<THREE.Group>(null);
  const heroCardRef = useRef<THREE.Group>(null);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Active range: 0.52 to 0.78
    const isVisible = scrollProgress >= 0.50 && scrollProgress <= 0.80;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const localT = THREE.MathUtils.clamp((scrollProgress - 0.55) / 0.20, 0, 1);

    // Hero card flips 180 degrees to reveal identity
    if (heroCardRef.current) {
      heroCardRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI, localT);
      heroCardRef.current.position.z = THREE.MathUtils.lerp(0.2, 0.8, localT);
    }

    if (cardsRef.current) {
      cardsRef.current.rotation.y += delta * 0.05;
    }
  });

  // 5 card spread
  const cardData = [
    { x: -1.8, rotZ: 0.2, role: 'Businessman' },
    { x: -0.9, rotZ: 0.1, role: 'Taxman' },
    { x: 0, rotZ: 0, role: 'Assassin' }, // Hero card
    { x: 0.9, rotZ: -0.1, role: 'Detective' },
    { x: 1.8, rotZ: -0.2, role: 'Politician' },
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
        <group ref={cardsRef} position={[0, 0.2, 1.2]}>
          {cardData.map((card, i) => {
            const isHero = i === 2;
            return (
              <group
                key={card.role}
                ref={isHero ? heroCardRef : undefined}
                position={[card.x, 0, (2 - Math.abs(2 - i)) * 0.1]}
                rotation={[0, 0, card.rotZ]}
              >
                {/* Playing Card Body */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.3, 1.9, 0.02]} />
                  <meshStandardMaterial
                    color="#140826"
                    roughness={0.25}
                    metalness={0.8}
                  />
                </mesh>

                {/* Back Face: Gold Foil Seal */}
                <mesh position={[0, 0, 0.012]}>
                  <planeGeometry args={[1.15, 1.75]} />
                  <meshStandardMaterial
                    color="#2C115F"
                    emissive="#F59E0B"
                    emissiveIntensity={0.35}
                    roughness={0.2}
                    metalness={0.9}
                  />
                </mesh>

                {/* Front Face: Secret Identity Illustration */}
                <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[1.15, 1.75]} />
                  <meshStandardMaterial
                    color="#DC2626"
                    emissive="#F59E0B"
                    emissiveIntensity={0.5}
                    roughness={0.3}
                    metalness={0.5}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      </Float>
    </group>
  );
};
