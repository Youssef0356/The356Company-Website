import { FC, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const CameraRig: FC = () => {
  const { camera, pointer } = useThree();
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const p = Math.min(1.0, Math.max(0.0, scrollProgress));

    // Left Focal Element World Anchor
    const focalElementPos = new THREE.Vector3(-3.1, 0.1, 0.4);

    // ==========================================
    // 5-PHASE BERSUS CAMERA CHOREOGRAPHY
    // ==========================================
    if (p < 0.35) {
      // PHASE 0 & 1: Wide Monumental View (Silhouette -> Color Awakening)
      const t = p / 0.35;
      const easedT = THREE.MathUtils.smoothstep(t, 0.0, 1.0);

      targetCamPos.current.set(
        0,
        THREE.MathUtils.lerp(0, 0.15, easedT),
        THREE.MathUtils.lerp(7.8, 6.2, easedT)
      );
      targetLookAt.current.set(0, 0, 0);
    } else if (p < 0.60) {
      // PHASE 2: Cinematic Dolly & Pan toward Left Satellite / Laptop
      const t = (p - 0.35) / 0.25;
      const easedT = THREE.MathUtils.smoothstep(t, 0.0, 1.0);

      targetCamPos.current.set(
        THREE.MathUtils.lerp(0, -2.3, easedT),
        THREE.MathUtils.lerp(0.15, 0.45, easedT),
        THREE.MathUtils.lerp(6.2, 3.0, easedT)
      );

      targetLookAt.current.set(
        THREE.MathUtils.lerp(0, focalElementPos.x, easedT),
        THREE.MathUtils.lerp(0, focalElementPos.y, easedT),
        THREE.MathUtils.lerp(0, focalElementPos.z, easedT)
      );
    } else if (p < 0.85) {
      // PHASE 3: Tight Focus, Animation & High-Frequency Camera Shake on Disassembly
      const t = (p - 0.60) / 0.25;
      const shakeIntensity = Math.min(0.05, Math.pow(t, 1.5) * 0.045);

      // High frequency shake noise
      const shakeX = Math.sin(time * 48) * shakeIntensity + Math.cos(time * 33) * shakeIntensity * 0.5;
      const shakeY = Math.cos(time * 52) * shakeIntensity + Math.sin(time * 29) * shakeIntensity * 0.5;

      targetCamPos.current.set(
        THREE.MathUtils.lerp(-2.3, -2.4, t) + shakeX,
        THREE.MathUtils.lerp(0.45, 0.35, t) + shakeY,
        THREE.MathUtils.lerp(3.0, 2.5, t)
      );

      targetLookAt.current.copy(focalElementPos);
    } else {
      // PHASE 4 & 5: Fly-through & Complete Blackout Intro
      targetCamPos.current.set(-2.4, 0.35, 2.3);
      targetLookAt.current.copy(focalElementPos);
    }

    // Interactive pointer parallax
    const parallaxX = pointer.x * (p < 0.35 ? 0.35 : 0.12);
    const parallaxY = pointer.y * (p < 0.35 ? 0.22 : 0.08);

    const lerpSpeed = Math.min(1.0, delta * 3.8);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetCamPos.current.x + parallaxX,
      lerpSpeed
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetCamPos.current.y + parallaxY,
      lerpSpeed
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetCamPos.current.z,
      lerpSpeed
    );

    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
