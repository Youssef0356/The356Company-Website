import { FC, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const CameraRig: FC = () => {
  const { camera, pointer } = useThree();
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const p = scrollProgress;

    // Interpolate camera path based on master scroll timeline ranges
    if (p < 0.15) {
      // Scene 01: Genesis (0.0 to 0.15)
      const t = p / 0.15;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0, 0, t),
        THREE.MathUtils.lerp(0, 0, t),
        THREE.MathUtils.lerp(7, 3.5, t)
      );
    } else if (p < 0.35) {
      // Scene 02: AR Explorer (0.15 to 0.35)
      const t = (p - 0.15) / 0.20;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(2.5, 0, t),
        THREE.MathUtils.lerp(1.5, 0, t),
        THREE.MathUtils.lerp(5.5, 4.0, t)
      );
    } else if (p < 0.55) {
      // Scene 03: Pagelit (0.35 to 0.55)
      const t = (p - 0.35) / 0.20;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(-2.0, 0, t),
        THREE.MathUtils.lerp(1.0, 0, t),
        THREE.MathUtils.lerp(5.0, 4.2, t)
      );
    } else if (p < 0.75) {
      // Scene 04: The System (0.55 to 0.75)
      const t = (p - 0.55) / 0.20;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0, 0, t),
        THREE.MathUtils.lerp(2.8, 1.8, t),
        THREE.MathUtils.lerp(4.5, 4.0, t)
      );
    } else if (p < 0.90) {
      // Scene 05: Battle Cows (0.75 to 0.90)
      const t = (p - 0.75) / 0.15;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(3.8, 2.5, t),
        THREE.MathUtils.lerp(4.2, 3.2, t),
        THREE.MathUtils.lerp(5.2, 4.2, t)
      );
    } else {
      // Scene 06: Ecosystem Constellation (0.90 to 1.0)
      const t = (p - 0.90) / 0.10;
      targetCamPos.current.set(
        0,
        THREE.MathUtils.lerp(0, 0.5, t),
        THREE.MathUtils.lerp(6.0, 8.5, t)
      );
    }

    // Gentle cursor parallax dampening
    const parallaxX = pointer.x * 0.4;
    const parallaxY = pointer.y * 0.25;

    const lerpSpeed = Math.min(1, delta * 3.5);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos.current.x + parallaxX, lerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos.current.y + parallaxY, lerpSpeed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, lerpSpeed);

    camera.lookAt(targetLookAt.current);
  });

  return null;
};
