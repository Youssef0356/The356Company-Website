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

    // Phone Anchor
    const phoneCenter = new THREE.Vector3(3.20, 0.20, 0.00);      // Phone on Right
    const phoneCamPos = new THREE.Vector3(3.20, 0.20, 2.20);
    
    // Laptop Closed & Open Anchors (Calibrated with exact world bounding centers)
    // Laptop sits at X = -3.20, Y = 0.00, Z = 0.00 in world space
    const pcClosedCenter = new THREE.Vector3(-3.20, 0.04, 0.58);     // Center of closed laptop keyboard deck
    const pcClosedCamPos = new THREE.Vector3(-3.20, 1.15, 2.45);     // Elevated 3/4 angle clearly revealing closed hardware
    
    // Open Laptop display showcase framing (Laptop center in world space is Y ~ 0.63, Z ~ -0.18)
    const pcOpenScreenCenter = new THREE.Vector3(-3.20, 0.63, -0.18); // Direct center of open display
    const pcOpenCamPos = new THREE.Vector3(-3.20, 1.10, 1.45);        // Square eye-level display framing

    // =========================================================================
    // CAMERA CHOREOGRAPHY: LOGO -> EXTENDED PHONE -> SWEEP -> CLOSED LAPTOP -> LAPTOP OPENS -> DISPLAY SHOWCASE
    // =========================================================================
    if (p < 0.12) {
      // 1. CENTER STAGE: Logo Medallion Intro (0.0 to 0.12)
      const t = p / 0.12;
      const easedT = THREE.MathUtils.smoothstep(t, 0.0, 1.0);

      targetCamPos.current.set(
        0,
        THREE.MathUtils.lerp(0, 0.05, easedT),
        THREE.MathUtils.lerp(7.2, 6.4, easedT)
      );
      targetLookAt.current.set(0, 0, 0);

    } else if (p < 0.18) {
      // 2. DOLLY TO PHONE (0.12 to 0.18)
      const dollyT = (p - 0.12) / 0.06;
      const easedDollyT = THREE.MathUtils.smoothstep(dollyT, 0.0, 1.0);

      targetCamPos.current.set(
        THREE.MathUtils.lerp(0, phoneCamPos.x, easedDollyT),
        THREE.MathUtils.lerp(0.05, phoneCamPos.y, easedDollyT),
        THREE.MathUtils.lerp(6.4, phoneCamPos.z, easedDollyT)
      );

      targetLookAt.current.set(
        THREE.MathUtils.lerp(0, phoneCenter.x, easedDollyT),
        THREE.MathUtils.lerp(0, phoneCenter.y, easedDollyT),
        THREE.MathUtils.lerp(0, phoneCenter.z, easedDollyT)
      );

    } else if (p < 0.54) {
      // 3. EXTENDED PHONE SHOWCASE (0.18 to 0.54)
      // Generous runway where camera stays focused on phone as it rotates and screenshots cycle
      const swayX = Math.sin(time * 0.7) * 0.015;
      const swayY = Math.cos(time * 0.6) * 0.012;

      targetCamPos.current.set(phoneCamPos.x + swayX, phoneCamPos.y + swayY, phoneCamPos.z);
      targetLookAt.current.set(phoneCenter.x, phoneCenter.y, phoneCenter.z);

    } else if (p < 0.64) {
      // 4. CINEMATIC SWEEP TO CLOSED LAPTOP (0.54 to 0.64)
      const sweepT = (p - 0.54) / 0.10;
      const easedT = THREE.MathUtils.smoothstep(sweepT, 0.0, 1.0);
      const arcZ = Math.sin(easedT * Math.PI) * 1.2;

      targetCamPos.current.set(
        THREE.MathUtils.lerp(phoneCamPos.x, pcClosedCamPos.x, easedT),
        THREE.MathUtils.lerp(phoneCamPos.y, pcClosedCamPos.y, easedT),
        THREE.MathUtils.lerp(phoneCamPos.z, pcClosedCamPos.z, easedT) + arcZ
      );

      targetLookAt.current.set(
        THREE.MathUtils.lerp(phoneCenter.x, pcClosedCenter.x, easedT),
        THREE.MathUtils.lerp(phoneCenter.y, pcClosedCenter.y, easedT),
        THREE.MathUtils.lerp(phoneCenter.z, pcClosedCenter.z, easedT)
      );

    } else if (p < 0.68) {
      // 5. ARRIVED AT CLOSED LAPTOP — HOLD & VIEW CLOSED HARDWARE (0.64 to 0.68)
      const swayX = Math.sin(time * 0.6) * 0.010;
      const swayY = Math.cos(time * 0.5) * 0.008;

      targetCamPos.current.set(pcClosedCamPos.x + swayX, pcClosedCamPos.y + swayY, pcClosedCamPos.z);
      targetLookAt.current.set(pcClosedCenter.x, pcClosedCenter.y, pcClosedCenter.z);

    } else if (p < 0.78) {
      // 6. LAPTOP OPENS — CAMERA RISES AND TILTS WITH OPENING LID (0.68 to 0.78)
      const openT = (p - 0.68) / 0.10;
      const easedOpenT = THREE.MathUtils.smoothstep(openT, 0.0, 1.0);

      targetCamPos.current.set(
        THREE.MathUtils.lerp(pcClosedCamPos.x, pcOpenCamPos.x, easedOpenT),
        THREE.MathUtils.lerp(pcClosedCamPos.y, pcOpenCamPos.y, easedOpenT),
        THREE.MathUtils.lerp(pcClosedCamPos.z, pcOpenCamPos.z, easedOpenT)
      );

      targetLookAt.current.set(
        THREE.MathUtils.lerp(pcClosedCenter.x, pcOpenScreenCenter.x, easedOpenT),
        THREE.MathUtils.lerp(pcClosedCenter.y, pcOpenScreenCenter.y, easedOpenT),
        THREE.MathUtils.lerp(pcClosedCenter.z, pcOpenScreenCenter.z, easedOpenT)
      );

    } else if (p < 0.94) {
      // 7. OPEN DISPLAY CLOSE-UP SHOWCASE & DESKTOP SLIDESHOW (0.78 to 0.94)
      const subtleSwayX = Math.sin(time * 0.6) * 0.006;
      const subtleSwayY = Math.cos(time * 0.5) * 0.004;

      targetCamPos.current.set(
        pcOpenCamPos.x + subtleSwayX,
        pcOpenCamPos.y + subtleSwayY,
        pcOpenCamPos.z
      );

      targetLookAt.current.set(
        pcOpenScreenCenter.x,
        pcOpenScreenCenter.y,
        pcOpenScreenCenter.z
      );

    } else {
      // 8. BLACKOUT & MANIFESTO (0.94 to 1.00)
      targetCamPos.current.set(pcOpenCamPos.x, pcOpenCamPos.y, pcOpenCamPos.z);
      targetLookAt.current.set(pcOpenScreenCenter.x, pcOpenScreenCenter.y, pcOpenScreenCenter.z);
    }

    // Pointer Parallax
    const parallaxWeight = p < 0.16 ? 0.35 : 0.05;
    const parallaxX = pointer.x * parallaxWeight;
    const parallaxY = pointer.y * (parallaxWeight * 0.6);

    const posLerp = Math.min(1.0, delta * 5.0);
    const lookLerp = Math.min(1.0, delta * 6.5);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos.current.x + parallaxX, posLerp);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos.current.y + parallaxY, posLerp);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, posLerp);

    currentLookAt.current.lerp(targetLookAt.current, lookLerp);
    camera.lookAt(currentLookAt.current);

    if (typeof window !== 'undefined') {
      (window as any).__THREE_CAMERA = camera;
      (window as any).__THREE_SCENE = state.scene;
      (window as any).__THREE_GL = state.gl;
      (window as any).__CAM_DEBUG = {
        pos: [camera.position.x, camera.position.y, camera.position.z],
        targetPos: [targetCamPos.current.x, targetCamPos.current.y, targetCamPos.current.z],
        lookAt: [currentLookAt.current.x, currentLookAt.current.y, currentLookAt.current.z],
        targetLookAt: [targetLookAt.current.x, targetLookAt.current.y, targetLookAt.current.z],
        p,
      };
    }
  });

  return null;
};
