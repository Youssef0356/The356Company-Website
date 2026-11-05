import { FC, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

// Atmospheric color profiles per section
const ATMOSPHERE_PALETTES = [
  // Scene 0: Genesis (Studio Purple)
  { top: '#160833', bottom: '#070212', accent: '#DCB0FF', particle: '#DCB0FF', lightPos: [0, 4, 3] },
  // Scene 1: AR Explorer (Electric Spatial Blue & Cyan)
  { top: '#081D42', bottom: '#030B1A', accent: '#38BDF8', particle: '#00E5FF', lightPos: [3, 4, 2] },
  // Scene 2: Pagelit (Luminous Cyan & Deep Teal)
  { top: '#08333D', bottom: '#021317', accent: '#00E5FF', particle: '#A7F3D0', lightPos: [-3, 4, 2] },
  // Scene 3: The System (Noir Crimson & Amber Gold)
  { top: '#300808', bottom: '#120303', accent: '#F59E0B', particle: '#FBBF24', lightPos: [0, 5, 2] },
  // Scene 4: Battle Cows (Lush Meadow Emerald & Honey)
  { top: '#083820', bottom: '#02170D', accent: '#10B981', particle: '#6EE7B7', lightPos: [3, 5, 3] },
  // Scene 5: Ecosystem (Celestial Convergence)
  { top: '#1B0B3B', bottom: '#070212', accent: '#DCB0FF', particle: '#DCB0FF', lightPos: [0, 6, 4] },
];

export const AtmosphereBackground: FC = () => {
  const { pointer } = useThree();
  const activeSceneIndex = useExperienceStore((s) => s.activeSceneIndex);
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  const particlesRef = useRef<THREE.Points>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  // Generate 400 floating stardust particles
  const particleCount = 400;
  const { positions, originalY } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const origY = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      origY[i] = pos[i * 3 + 1];
    }
    return { positions: pos, originalY: origY };
  }, []);

  useFrame((state, delta) => {
    const target = ATMOSPHERE_PALETTES[activeSceneIndex] || ATMOSPHERE_PALETTES[0];
    const lerpSpeed = Math.min(1, delta * 2.5);

    // Smoothly interpolate ambient & spot light colors
    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(new THREE.Color(target.top), lerpSpeed);
    }
    if (spotLightRef.current) {
      spotLightRef.current.color.lerp(new THREE.Color(target.accent), lerpSpeed);
      // Subtle mouse follow on spotlight
      spotLightRef.current.position.x = THREE.MathUtils.lerp(
        spotLightRef.current.position.x,
        target.lightPos[0] + pointer.x * 2.0,
        lerpSpeed
      );
      spotLightRef.current.position.y = THREE.MathUtils.lerp(
        spotLightRef.current.position.y,
        target.lightPos[1] + pointer.y * 1.5,
        lerpSpeed
      );
    }

    // Gentle upward particle drift with zero-g oscillation
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < particleCount; i++) {
        // Slow float up
        arr[i * 3 + 1] = originalY[i] + Math.sin(time * 0.4 + i) * 0.4 - scrollProgress * 5;
        // Wrap around vertically
        if (arr[i * 3 + 1] < -12) {
          arr[i * 3 + 1] += 24;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={1.8} />
      <spotLight
        ref={spotLightRef}
        position={[0, 4, 3]}
        angle={0.65}
        penumbra={0.9}
        intensity={4.5}
      />

      {/* Floating Stardust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#DCB0FF"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};
