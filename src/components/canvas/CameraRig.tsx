import { FC, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

export const CameraRig: FC = () => {
  const { camera, pointer } = useThree();
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const p = Math.min(1.0, Math.max(0.0, scrollProgress));

    // World Anchors
    const phoneCenter = new THREE.Vector3(3.2, 0.15, 0.0);   // Phone on Right
    const pcCenter = new THREE.Vector3(-3.2, 0.15, 0.0);      // PC / Laptop on Left

    // =========================================================================
    // CAMERA CHOREOGRAPHY: LOGO (Center) -> PHONE (Right) -> PC (Left) -> BLACKOUT
    // =========================================================================
    if (p < 0.16) {
      // 1. CENTER STAGE: Logo Medallion (0.0 to 0.16)
      const t = p / 0.16;
      const easedT = THREE.MathUtils.smoothstep(t, 0.0, 1.0);

      targetCamPos.current.set(
        0,
        THREE.MathUtils.lerp(0, 0.05, easedT),
        THREE.MathUtils.lerp(7.5, 6.4, easedT)
      );
      targetLookAt.current.set(0, 0, 0);

    } else if (p < 0.40) {
      // 2. ZOOM TO PHONE FIRST (0.16 to 0.40)
      // Camera dollies right in front of the Phone and centers it
      const t = (p - 0.16) / 0.24;
      const easedT = THREE.MathUtils.smoothstep(t, 0.0, 1.0);

      targetCamPos.current.set(
        THREE.MathUtils.lerp(0, phoneCenter.x, easedT),
        THREE.MathUtils.lerp(0.05, phoneCenter.y, easedT),
        THREE.MathUtils.lerp(6.4, 2.0, easedT)
      );

      targetLookAt.current.set(
        THREE.MathUtils.lerp(0, phoneCenter.x, easedT),
        THREE.MathUtils.lerp(0, phoneCenter.y, easedT),
        THREE.MathUtils.lerp(0, phoneCenter.z, easedT)
      );

    } else if (p < 0.68) {
      // 3. SWEEP FROM PHONE OVER TO PC (0.40 to 0.68)
      // Camera sweeps across the entire studio over to the Laptop on the left
      const t = (p - 0.40) / 0.28;
      const easedT = THREE.MathUtils.smoothstep(t, 0.0, 1.0);

      // Arc pull-back in Z during transit
      const arcZ = Math.sin(easedT * Math.PI) * 1.6;

      targetCamPos.current.set(
        THREE.MathUtils.lerp(phoneCenter.x, pcCenter.x, easedT),
        THREE.MathUtils.lerp(phoneCenter.y, pcCenter.y, easedT),
        THREE.MathUtils.lerp(2.0, 2.3, easedT) + arcZ
      );

      targetLookAt.current.set(
        THREE.MathUtils.lerp(phoneCenter.x, pcCenter.x, easedT),
        THREE.MathUtils.lerp(phoneCenter.y, pcCenter.y, easedT),
        THREE.MathUtils.lerp(phoneCenter.z, pcCenter.z, easedT)
      );

    } else if (p < 0.86) {
      // 4. FOCUS ON PC / LAPTOP (0.68 to 0.86)
      const t = (p - 0.68) / 0.18;
      const shakeIntensity = Math.min(0.03, Math.pow(t, 1.5) * 0.025);

      const shakeX = Math.sin(time * 48) * shakeIntensity;
      const shakeY = Math.cos(time * 52) * shakeIntensity;

      targetCamPos.current.set(
        pcCenter.x + shakeX,
        pcCenter.y + shakeY,
        THREE.MathUtils.lerp(2.3, 1.9, t)
      );

      targetLookAt.current.copy(pcCenter);

    } else {
      // 5. BLACKOUT & MANIFESTO (0.86 to 1.00)
      targetCamPos.current.set(pcCenter.x, pcCenter.y, 1.9);
      targetLookAt.current.copy(pcCenter);
    }

    // Pointer Parallax
    const parallaxWeight = p < 0.16 ? 0.35 : 0.08;
    const parallaxX = pointer.x * parallaxWeight;
    const parallaxY = pointer.y * (parallaxWeight * 0.6);

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
