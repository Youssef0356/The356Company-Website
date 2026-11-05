import { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

const SCENE_LIGHT_CONFIGS = [
  // Scene 01: Genesis (Cosmic Deep Purple)
  { ambient: '#2C115F', intensity: 1.2, spotColor: '#DCB0FF', spotIntensity: 4.0, spotPos: [0, 6, 6] },
  // Scene 02: AR Explorer (Cobalt & Cyan)
  { ambient: '#0A192F', intensity: 1.4, spotColor: '#38BDF8', spotIntensity: 5.0, spotPos: [2, 6, 5] },
  // Scene 03: Pagelit (Clean Paper White & Cyan)
  { ambient: '#1E1B4B', intensity: 1.5, spotColor: '#00E5FF', spotIntensity: 5.5, spotPos: [-2, 6, 5] },
  // Scene 04: The System (Noir Table Amber)
  { ambient: '#180B02', intensity: 0.6, spotColor: '#F59E0B', spotIntensity: 7.0, spotPos: [0, 5, 3] },
  // Scene 05: Battle Cows (Lush Meadow Sunlight)
  { ambient: '#064E3B', intensity: 1.8, spotColor: '#FDE047', spotIntensity: 6.0, spotPos: [4, 8, 6] },
  // Scene 06: Ecosystem (Radiant Purple Finale)
  { ambient: '#2C115F', intensity: 1.6, spotColor: '#FFFFFF', spotIntensity: 6.5, spotPos: [0, 8, 8] },
];

export const Lighting: FC = () => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const activeIndex = useExperienceStore((s) => s.activeSceneIndex);

  useFrame((_, delta) => {
    const target = SCENE_LIGHT_CONFIGS[activeIndex] || SCENE_LIGHT_CONFIGS[0];
    const lerpSpeed = Math.min(1, delta * 3.0);

    if (ambientRef.current) {
      ambientRef.current.color.lerp(new THREE.Color(target.ambient), lerpSpeed);
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        target.intensity,
        lerpSpeed
      );
    }
    if (spotRef.current) {
      spotRef.current.color.lerp(new THREE.Color(target.spotColor), lerpSpeed);
      spotRef.current.intensity = THREE.MathUtils.lerp(
        spotRef.current.intensity,
        target.spotIntensity,
        lerpSpeed
      );
      spotRef.current.position.lerp(
        new THREE.Vector3(target.spotPos[0], target.spotPos[1], target.spotPos[2]),
        lerpSpeed
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={1.2} />
      <spotLight
        ref={spotRef}
        position={[0, 6, 6]}
        angle={0.5}
        penumbra={0.8}
        castShadow
        shadow-bias={-0.0001}
      />
    </>
  );
};
