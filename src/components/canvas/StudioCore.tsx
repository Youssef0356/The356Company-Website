import { FC, useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

// Preload the Studio Core 3D model
useGLTF.preload('/models/studio_core.glb');

// 6 Phone portrait screenshots from published apps
const PHONE_SCREENSHOTS = [
  '/screenshots/pagelit/play_01.png',
  '/screenshots/ar-explorer/play_01.png',
  '/screenshots/the-system/play_01.png',
  '/screenshots/battle-cows/play_01.png',
  '/screenshots/pagelit/play_02.png',
  '/screenshots/the-system/play_02.png',
];

// 6 Laptop landscape showcases
const LAPTOP_SCREENSHOTS = [
  '/screenshots/laptop/slide_01_pagelit.png',
  '/screenshots/laptop/slide_02_ar_explorer.png',
  '/screenshots/laptop/slide_03_the_system.png',
  '/screenshots/laptop/slide_04_battle_cows.png',
  '/screenshots/laptop/slide_05_pagelit_pro.png',
  '/screenshots/laptop/slide_06_studio_showcase.png',
];

export const StudioCore: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const medallionRef = useRef<THREE.Object3D | null>(null);
  const initialMedallionQuat = useRef<THREE.Quaternion | null>(null);
  const ringsRef = useRef<THREE.Object3D | null>(null);
  const innerRingRef = useRef<THREE.Object3D | null>(null);
  const outerRingRef = useRef<THREE.Object3D | null>(null);
  const harmonicInnerRingRef = useRef<THREE.Mesh | null>(null);
  const harmonicMidRingRef = useRef<THREE.Mesh | null>(null);
  const signalNodesGroupRef = useRef<THREE.Group | null>(null);
  const floatingGroupRef = useRef<THREE.Object3D | null>(null);
  const satellitesListRef = useRef<THREE.Object3D[]>([]);

  // Phone references
  const phoneRef = useRef<THREE.Object3D | null>(null);
  const initialPhoneQuat = useRef<THREE.Quaternion | null>(null);
  const initialPhoneScale = useRef<THREE.Vector3 | null>(null);
  const phoneScreenMeshRef = useRef<THREE.Mesh | null>(null);

  // Precomputed exact vertical upright orientation facing camera in Three.js
  const targetVerticalPhoneQuat = useMemo(() => {
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  }, []);

  // Laptop references
  const laptopRef = useRef<THREE.Object3D | null>(null);
  const initialLaptopQuat = useRef<THREE.Quaternion | null>(null);
  const laptopHingeRef = useRef<THREE.Object3D | null>(null);
  const laptopLidRef = useRef<THREE.Object3D | null>(null);
  const laptopBaseRef = useRef<THREE.Object3D | null>(null);
  const laptopScreenMeshRef = useRef<THREE.Mesh | null>(null);

  // Dynamic light refs for balanced studio lighting (no overblown bloom)
  const spotKeyRef = useRef<THREE.SpotLight>(null);
  const spotRimRightRef = useRef<THREE.SpotLight>(null);
  const spotRimLeftRef = useRef<THREE.SpotLight>(null);
  const pointAbyssRef = useRef<THREE.PointLight>(null);
  // Dedicated close-range screen illumination light for laptop showcase
  const laptopScreenLightRef = useRef<THREE.PointLight>(null);
  const spotLaptopRef = useRef<THREE.SpotLight>(null);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Preload textures for Phone and Laptop
  const phoneTextures = useTexture(PHONE_SCREENSHOTS);
  const laptopTextures = useTexture(LAPTOP_SCREENSHOTS);

  // Configure texture color spaces
  useMemo(() => {
    [...phoneTextures, ...laptopTextures].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
  }, [phoneTextures, laptopTextures]);

  // Dedicated dynamic screen materials
  const phoneScreenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: phoneTextures[0],
      emissiveMap: phoneTextures[0],
      emissive: new THREE.Color('#FFFFFF'),
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.1,
      toneMapped: false,
    });
  }, [phoneTextures]);

  const laptopScreenMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: laptopTextures[0],
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      toneMapped: false,
    });
  }, [laptopTextures]);

  // Load the Studio Core GLB
  const { scene } = useGLTF('/models/studio_core.glb');

  // Pure clone of scene & material/geometry setup (no ref side-effects inside useMemo so React 19 StrictMode never orphans refs)
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      // Disable duplicate baked lights from GLB so they don't overexpose with Bloom
      if ((child as THREE.Light).isLight) {
        (child as THREE.Light).intensity = 0.0;
        child.visible = false;
        return;
      }

      // Hide any embedded GLB point clouds that look rough/noisy
      if ((child as THREE.Points).isPoints) {
        child.visible = false;
        return;
      }

      // Hide baked stardust Icosphere motes — they look noisy at this scale,
      // replaced by the procedural AtmosphereBackground particles
      if (child.name.startsWith('Stardust_Mote_')) {
        child.visible = false;
        return;
      }

      if (child.name === 'MobilePhone_Phone_Emission_0') {
        (child as THREE.Mesh).material = phoneScreenMaterial;
      } else if (child.name === 'Laptop_Hinge') {
        // Hinge pivot that rotates the lid — start fully closed (-1.894 rad = -108.5 deg from upright, resting flat on keyboard)
        child.rotation.x = -1.894;
      } else if (child.name === 'Laptop_Laptop1_0001_1') {
        // Embedded Screen Mesh physically rigged inside Laptop_Lid
        const screenMesh = child as THREE.Mesh;
        screenMesh.visible = true;
        screenMesh.frustumCulled = false;
        screenMesh.material = laptopScreenMaterial;
        screenMesh.renderOrder = 10;

        // Correct 4-vertex quad UVs so texture maps perfectly right side up and crisp
        // v1 = Top-Left (0, 1), v0 = Top-Right (1, 1), v2 = Bottom-Left (0, 0), v3 = Bottom-Right (1, 0)
        const uvAttr = screenMesh.geometry.attributes.uv;
        if (uvAttr && uvAttr.count === 4) {
          uvAttr.setXY(0, 1, 1); // v0: Top-Right
          uvAttr.setXY(1, 0, 1); // v1: Top-Left
          uvAttr.setXY(2, 0, 0); // v2: Bottom-Left
          uvAttr.setXY(3, 1, 0); // v3: Bottom-Right
          uvAttr.needsUpdate = true;
        }
        screenMesh.geometry.computeVertexNormals();
        screenMesh.geometry.computeBoundingBox();
        screenMesh.geometry.computeBoundingSphere();
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Ensure all laptop components are never frustum-culled
        if (child.name.startsWith('Laptop')) {
          mesh.frustumCulled = false;
        }

        // Apply sleek metallic studio finish to laptop casing
        if (child.name === 'Laptop_Base' || child.name === 'Laptop_Laptop1_0001') {
          if (!Array.isArray(mesh.material) && mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.side = THREE.DoubleSide;
            mat.metalness = 0.75;
            mat.roughness = 0.30;
            mat.color = new THREE.Color('#5E527B');
            mat.emissive = new THREE.Color('#1F1432');
            mat.emissiveIntensity = 0.35;
            mat.needsUpdate = true;
          }
          if (child.name === 'Laptop_Laptop1_0001') {
            mesh.renderOrder = 1;
          }
        } else if (child.name === 'Orbital_Ring_Inner') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#B57CFF'),
            emissive: new THREE.Color('#DCB0FF'),
            emissiveIntensity: 0.95,
            metalness: 0.88,
            roughness: 0.15,
          });
        } else if (child.name === 'Orbital_Ring_Inner_Glow') {
          // Protrude inner glow strip outside the titanium torus so its neon core radiates clearly
          child.scale.set(1.005, 4.5, 1.005);
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FFFFFF'),
            emissive: new THREE.Color('#F3E8FF'),
            emissiveIntensity: 1.85,
            roughness: 0.1,
            metalness: 0.1,
            toneMapped: false,
          });
        } else if (child.name === 'Orbital_Ring_Outer') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#7C4DFF'),
            emissive: new THREE.Color('#4A1C96'),
            emissiveIntensity: 0.85,
            metalness: 0.90,
            roughness: 0.14,
          });
        } else if (child.name === 'Orbital_Ring_Outer_Glow') {
          // Protrude outer glow strip outside the outer torus
          child.scale.set(1.004, 3.2, 1.004);
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#DCB0FF'),
            emissive: new THREE.Color('#DCB0FF'),
            emissiveIntensity: 1.65,
            roughness: 0.1,
            metalness: 0.1,
            toneMapped: false,
          });
        } else if (child.name === 'Medallion_Neon_Trench') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FFFFFF'),
            emissive: new THREE.Color('#DCB0FF'),
            emissiveIntensity: 2.1,
            roughness: 0.1,
            toneMapped: false,
          });
        } else if (!Array.isArray(mesh.material) && mesh.material) {
          // Apply material quality improvements to non-screen meshes
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.needsUpdate = true;
          if (mat !== phoneScreenMaterial && (mat as any) !== laptopScreenMaterial) {
            if (mat.roughness !== undefined) mat.roughness = Math.max(0.25, mat.roughness);
            if (mat.metalness !== undefined) mat.metalness = Math.min(0.85, mat.metalness);
          }
        }
      }
    });

    return cloned;
  }, [scene, phoneScreenMaterial, laptopScreenMaterial]);

  // Bind all refs to the committed clonedScene instance mounted in the scene graph
  useLayoutEffect(() => {
    satellitesListRef.current = [];
    phoneRef.current = null;

    clonedScene.traverse((child) => {
      if (child.name.startsWith('Satellite')) {
        satellitesListRef.current.push(child);
      }
      if (child.name === 'Monogram_Medallion') {
        medallionRef.current = child;
        if (!initialMedallionQuat.current) {
          initialMedallionQuat.current = child.quaternion.clone();
        }
      } else if (child.name === 'Orbital_Rings_Group') {
        ringsRef.current = child;
      } else if (child.name === 'Orbital_Ring_Inner') {
        innerRingRef.current = child;
      } else if (child.name === 'Orbital_Ring_Outer') {
        outerRingRef.current = child;
      } else if (
        child.name === 'Floating_Elements_Group' ||
        child.name === 'Satellites_Group'
      ) {
        floatingGroupRef.current = child;
      } else if (child.name === 'Sketchfab_model' && !phoneRef.current) {
        phoneRef.current = child;
        if (!initialPhoneQuat.current) {
          initialPhoneQuat.current = child.quaternion.clone();
        }
        if (!initialPhoneScale.current) {
          initialPhoneScale.current = child.scale.clone();
        }
      } else if (child.name === 'MobilePhone_Phone_Emission_0') {
        phoneScreenMeshRef.current = child as THREE.Mesh;
      } else if (child.name === 'Laptop' || child.name === 'Sketchfab_model.001' || child.name === 'Sketchfab_model001') {
        laptopRef.current = child;
        if (!initialLaptopQuat.current) {
          initialLaptopQuat.current = child.quaternion.clone();
        }
      } else if (child.name === 'Laptop_Hinge') {
        laptopHingeRef.current = child;
      } else if (child.name === 'Laptop_Base') {
        laptopBaseRef.current = child;
      } else if (child.name === 'Laptop_Lid') {
        laptopLidRef.current = child;
      } else if (child.name === 'Laptop_Laptop1_0001_1') {
        laptopScreenMeshRef.current = child as THREE.Mesh;
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;
    const p = Math.min(1.0, Math.max(0.0, scrollProgress));

    // ==========================================
    // 1. CHOREOGRAPHED STUDIO LIGHTING (Mysterious Intro -> Radiant Exhibition)
    // ==========================================
    // At p=0: Elegant soft ambient studio glow so the 356 monogram and rings gleam at rest.
    // As user scrolls: Studio lights awaken to full brilliant exhibition intensity.
    const lightT = Math.min(1.0, Math.max(0.0, p / 0.14));
    const blackoutT = p > 0.95 ? Math.min(1.0, (p - 0.95) / 0.05) : 0.0;
    const masterLight = THREE.MathUtils.smoothstep(lightT, 0.0, 1.0) * (1.0 - blackoutT);
    const ambientBreath = Math.sin(time * 1.5) * 0.05;

    if (spotKeyRef.current) {
      spotKeyRef.current.intensity = THREE.MathUtils.lerp(0.55 + ambientBreath, 1.45, masterLight);
    }
    if (spotRimRightRef.current) {
      spotRimRightRef.current.intensity = THREE.MathUtils.lerp(0.40, 1.15, masterLight);
    }
    if (spotRimLeftRef.current) {
      spotRimLeftRef.current.intensity = THREE.MathUtils.lerp(0.45, 1.35, masterLight);
    }
    if (pointAbyssRef.current) {
      pointAbyssRef.current.intensity = THREE.MathUtils.lerp(0.20, 0.6, masterLight);
    }
    if (spotLaptopRef.current) {
      spotLaptopRef.current.intensity = THREE.MathUtils.lerp(0.15, 3.5, masterLight);
    }

    // ==========================================
    // 2. SUBTLE ZERO-GRAVITY BREATHING & POINTER PARALLAX
    // ==========================================
    if (groupRef.current) {
      const floatY = Math.sin(time * 0.7) * 0.04;
      groupRef.current.position.y = floatY;

      const targetRotX = pointer.y * 0.04;
      const targetRotY = pointer.x * 0.06;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        delta * 2.5
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        delta * 2.5
      );
    }

    // ==========================================
    // 3. MEDALLION AWAKENING & PRESENCE (p: 0.00 -> 0.14)
    // Always upright & legible — gentle spatial awakening without inverting the official logo
    // ==========================================
    if (medallionRef.current && initialMedallionQuat.current) {
      const awakenProgress = Math.min(1.0, Math.max(0.0, p / 0.10));
      const easedAwaken = THREE.MathUtils.smoothstep(awakenProgress, 0.0, 1.0);
      const subtleSwivel = (1.0 - easedAwaken) * 0.22 + Math.sin(time * 0.6) * 0.03;

      medallionRef.current.quaternion.copy(initialMedallionQuat.current);
      medallionRef.current.rotateZ(subtleSwivel);
    }

    // ==========================================
    // 4. FLOATING SATELLITES & BADGES (Appear as camera transitions -> Orbit with Phone -> Hide for Laptop)
    // ==========================================
    if (floatingGroupRef.current) {
      if (p < 0.10) {
        floatingGroupRef.current.visible = false;
        floatingGroupRef.current.scale.setScalar(0.0001);
      } else if (p < 0.20) {
        const appearProgress = (p - 0.10) / 0.10;
        const easedAppear = THREE.MathUtils.smoothstep(appearProgress, 0.0, 1.0);
        floatingGroupRef.current.visible = true;
        floatingGroupRef.current.scale.setScalar(Math.max(0.0001, easedAppear));
        floatingGroupRef.current.position.z = (1.0 - easedAppear) * -1.5;
      } else if (p < 0.48) {
        floatingGroupRef.current.visible = true;
        floatingGroupRef.current.scale.setScalar(1.0);
        floatingGroupRef.current.position.z = 0;
        floatingGroupRef.current.traverse((c) => {
          c.visible = true;
        });
      } else if (p < 0.54) {
        const fadeT = (p - 0.48) / 0.06;
        const s = THREE.MathUtils.lerp(1.0, 0.0001, fadeT);
        floatingGroupRef.current.visible = true;
        floatingGroupRef.current.scale.setScalar(s);
      } else {
        floatingGroupRef.current.visible = false;
        floatingGroupRef.current.scale.setScalar(0.0001);
        floatingGroupRef.current.traverse((c) => {
          c.visible = false;
        });
      }
    }

    // Unconditional visibility control over all satellites so NONE ever leak into intro or laptop showcase
    const showSatellites = p >= 0.10 && p < 0.54;
    clonedScene.traverse((child) => {
      if (child.name.startsWith('Satellite')) {
        child.visible = showSatellites;
      }
    });

    // ==========================================
    // 5. ORBITAL RINGS — 3:5:6 GYROSCOPE & CURSOR GIMBAL
    // ==========================================
    const ringsPushT = THREE.MathUtils.smoothstep(
      Math.min(1.0, Math.max(0.0, (p - 0.10) / 0.12)),
      0.0,
      1.0
    );

    if (ringsRef.current) {
      // At logo intro (p < 0.14), rings frame the center medallion closely at Z=-0.18
      // When exploring devices (p >= 0.14), rings push far back into background so they NEVER occlude devices
      ringsRef.current.position.z = THREE.MathUtils.lerp(-0.18, -4.8, ringsPushT);
      const ringScale = THREE.MathUtils.lerp(1.04, 0.55, ringsPushT);
      ringsRef.current.scale.setScalar(ringScale);

      // Interactive cursor gimbal tilt + subtle breathing
      const targetGimbalX = pointer.y * 0.22 * (1.0 - ringsPushT);
      const targetGimbalY = pointer.x * 0.28 * (1.0 - ringsPushT) + Math.sin(time * 0.35) * 0.12;
      ringsRef.current.rotation.x = THREE.MathUtils.lerp(ringsRef.current.rotation.x, targetGimbalX, delta * 3.0);
      ringsRef.current.rotation.y = THREE.MathUtils.lerp(ringsRef.current.rotation.y, targetGimbalY, delta * 3.0);
      ringsRef.current.rotation.z += delta * 0.08;
    }

    // Counter-rotating 3:5:6 ratio gyroscope on Inner & Outer GLB rings
    // In studio_core.glb, torus ring normals are along local Y, so Math.PI / 2 on X faces the camera (+Z).
    // Offsetting X and Z by ~0.36-0.42 rad tilts the rings in 3D space while keeping their minor axis > 1.70 (outside the 1.32 Medallion!)
    if (innerRingRef.current) {
      innerRingRef.current.scale.setScalar(1.16);
      innerRingRef.current.rotation.order = 'XZY';
      innerRingRef.current.rotation.x = Math.PI / 2 + 0.34 + Math.sin(time * 0.45) * 0.08;
      innerRingRef.current.rotation.z = -0.32 + Math.cos(time * 0.40) * 0.08;
      innerRingRef.current.rotation.y += delta * (0.38 + p * 0.45);
    }
    if (outerRingRef.current) {
      outerRingRef.current.scale.setScalar(1.06);
      outerRingRef.current.rotation.order = 'XZY';
      outerRingRef.current.rotation.x = Math.PI / 2 - 0.40 + Math.cos(time * 0.35) * 0.08;
      outerRingRef.current.rotation.z = 0.36 + Math.sin(time * 0.38) * 0.08;
      outerRingRef.current.rotation.y -= delta * (0.26 + p * 0.35);
    }

    // Sacred Geometry Harmonic Filament Rings & 4 Product Signal Nodes
    const harmonicVisibility = 1.0 - ringsPushT;
    if (harmonicInnerRingRef.current) {
      harmonicInnerRingRef.current.position.z = THREE.MathUtils.lerp(-0.18, -4.5, ringsPushT);
      harmonicInnerRingRef.current.scale.setScalar(THREE.MathUtils.lerp(1.08, 0.4, ringsPushT));
      harmonicInnerRingRef.current.rotation.x = -0.36 + Math.sin(time * 0.5) * 0.10 + pointer.y * 0.18;
      harmonicInnerRingRef.current.rotation.y = -0.32 + Math.cos(time * 0.4) * 0.10 + pointer.x * 0.18;
      harmonicInnerRingRef.current.rotation.z -= delta * 0.45;
      harmonicInnerRingRef.current.visible = harmonicVisibility > 0.02;
    }

    if (harmonicMidRingRef.current) {
      harmonicMidRingRef.current.position.z = THREE.MathUtils.lerp(-0.24, -4.8, ringsPushT);
      harmonicMidRingRef.current.scale.setScalar(THREE.MathUtils.lerp(1.02, 0.45, ringsPushT));
      harmonicMidRingRef.current.rotation.x = 0.36 + Math.cos(time * 0.35) * 0.10 - pointer.y * 0.15;
      harmonicMidRingRef.current.rotation.y = -0.40 + Math.sin(time * 0.32) * 0.10 + pointer.x * 0.18;
      harmonicMidRingRef.current.rotation.z += delta * 0.32;
      harmonicMidRingRef.current.visible = harmonicVisibility > 0.02;
    }

    if (signalNodesGroupRef.current) {
      signalNodesGroupRef.current.position.z = THREE.MathUtils.lerp(-0.15, -4.6, ringsPushT);
      signalNodesGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(1.0, 0.3, ringsPushT));
      signalNodesGroupRef.current.rotation.z = time * 0.35 + p * 2.5;
      signalNodesGroupRef.current.rotation.x = Math.sin(time * 0.4) * 0.16 + pointer.y * 0.2;
      signalNodesGroupRef.current.rotation.y = Math.cos(time * 0.35) * 0.16 + pointer.x * 0.25;
      signalNodesGroupRef.current.visible = harmonicVisibility > 0.02;
    }

    // ==========================================
    // 6. PHONE SHOWCASE & DYNAMIC SCROLL ROTATION (p: 0.12 -> 0.50)
    // Isolated during Entry Hook (p < 0.08) so the 356 Medallion commands 100% of attention
    // ==========================================
    if (phoneRef.current && initialPhoneQuat.current) {
      // Smoothly emerge phone from p = 0.07 -> 0.14 so it never steals focus at initial entry
      const phoneRevealT = THREE.MathUtils.smoothstep(
        Math.min(1.0, Math.max(0.0, (p - 0.07) / 0.07)),
        0.0,
        1.0
      );
      phoneRef.current.visible = phoneRevealT > 0.01;
      if (initialPhoneScale.current) {
        phoneRef.current.scale.copy(initialPhoneScale.current).multiplyScalar(Math.max(0.001, phoneRevealT));
      }
      phoneScreenMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.0, 0.65, phoneRevealT);

      if (p < 0.12) {
        // Floating idle tilt
        phoneRef.current.quaternion.copy(initialPhoneQuat.current);
        const idleRot = Math.sin(time * 0.8) * 0.04;
        phoneRef.current.rotateY(idleRot);
      } else if (p <= 0.18) {
        // Smooth rotation from zero-G orbit to stand vertically facing user
        const rotT = (p - 0.12) / 0.06;
        const easedRotT = THREE.MathUtils.smoothstep(rotT, 0.0, 1.0);

        phoneRef.current.quaternion.slerpQuaternions(
          initialPhoneQuat.current,
          targetVerticalPhoneQuat,
          easedRotT
        );
      } else if (p <= 0.50) {
        // DYNAMIC SCROLL ROTATION: As user keeps scrolling, phone dynamically turns
        // to showcase its sleek 3D hardware, beveled edges, and each mobile screen
        const phoneScrollProgress = (p - 0.18) / 0.32;
        
        // Base upright orientation
        phoneRef.current.quaternion.copy(targetVerticalPhoneQuat);

        // Scroll-driven Y-swivel (gentle turns between screenshots) and X-tilt
        const scrollSwivelY = Math.sin(phoneScrollProgress * Math.PI * 5.0) * 0.28 + (phoneScrollProgress - 0.5) * 0.35;
        const scrollTiltX = Math.cos(phoneScrollProgress * Math.PI * 4.0) * 0.08;
        const mouseTiltX = pointer.y * 0.02;
        const mouseTiltY = pointer.x * 0.03;

        phoneRef.current.rotateY(scrollSwivelY + mouseTiltY);
        phoneRef.current.rotateX(scrollTiltX + mouseTiltX);
      } else {
        // Smooth transition back to natural idle rotation during sweep to laptop
        const exitT = Math.min(1.0, Math.max(0.0, (p - 0.54) / 0.10));
        phoneRef.current.quaternion.slerpQuaternions(
          targetVerticalPhoneQuat,
          initialPhoneQuat.current,
          exitT
        );
      }

      // EXTENDED RUNWAY: Cycle all 6 App Screenshots on Phone Screen comfortably across p: 0.18 -> 0.54
      if (p >= 0.18 && p <= 0.54) {
        const slideProgress = Math.min(1.0, Math.max(0.0, (p - 0.18) / 0.36));
        const currentPhoneIdx = Math.min(5, Math.floor(slideProgress * 6));
        const activePhoneTex = phoneTextures[currentPhoneIdx];

        if (phoneScreenMaterial.map !== activePhoneTex) {
          phoneScreenMaterial.map = activePhoneTex;
          phoneScreenMaterial.emissiveMap = activePhoneTex;
          phoneScreenMaterial.needsUpdate = true;
        }
      }
    }


    // ==========================================
    // 7. 3D LAPTOP OPENING & SCREENSHOT SLIDESHOW
    // Stays 100% CLOSED upon arrival (p: 0.54 -> 0.68)
    // Opens smoothly right in front of the viewer from p = 0.68 to 0.78
    // Fully open & desktop screen slideshow from p = 0.78 to 0.94
    // ==========================================
    if (laptopRef.current) {
      // Keep laptop hidden during Medallion entry (p < 0.45) so its silhouette at x=-3.20 never clips the left edge of the hero frame
      laptopRef.current.visible = p >= 0.45;
    }

    const CLOSED_HINGE_X = -1.894; // Exact Blender kinematics: lid flat on keyboard deck
    const OPEN_HINGE_X = 0.0;     // Upright 108.5° display

    if (laptopHingeRef.current) {
      if (p < 0.68) {
        // Fully CLOSED — lid resting flat flush on keyboard (-1.894 rad / -108.5 deg from upright)
        laptopHingeRef.current.rotation.x = CLOSED_HINGE_X;
      } else if (p <= 0.78) {
        // Viewer is looking directly at laptop — lid smoothly swings open from -1.894 to 0.0 rad!
        const openProgress = (p - 0.68) / 0.10;
        const easedOpen = THREE.MathUtils.smoothstep(openProgress, 0.0, 1.0);
        laptopHingeRef.current.rotation.x = THREE.MathUtils.lerp(CLOSED_HINGE_X, OPEN_HINGE_X, easedOpen);
      } else {
        // Fully OPEN — screen standing upright at 108.5° angle, bright and square for desktop showcase
        laptopHingeRef.current.rotation.x = OPEN_HINGE_X;
      }

      // Hide unlit screen quad when lid is 100% closed so no bright edge leaks during intro/closed states
      if (laptopScreenMeshRef.current) {
        laptopScreenMeshRef.current.visible = p > 0.68;
      }

      // Explicitly update matrix hierarchy so children and screen mesh update without 1-frame lag
      laptopHingeRef.current.updateMatrix();
      laptopHingeRef.current.updateMatrixWorld(true);
    }

    // Dedicated screen & chassis fill light — illuminates the closed lid upon arrival, then brightens as it opens
    if (laptopScreenLightRef.current) {
      if (p < 0.54) {
        laptopScreenLightRef.current.intensity = 0.0;
      } else if (p <= 0.68) {
        // Illuminates the closed laptop casing as camera arrives
        const sweepLightT = (p - 0.54) / 0.14;
        laptopScreenLightRef.current.intensity = THREE.MathUtils.lerp(0.5, 3.2, sweepLightT);
      } else if (p <= 0.78) {
        // Intensifies as the lid opens and screen becomes visible
        const lt = (p - 0.68) / 0.10;
        laptopScreenLightRef.current.intensity = THREE.MathUtils.lerp(3.2, 4.5, lt);
      } else {
        laptopScreenLightRef.current.intensity = 4.5;
      }
    }

    // Cycle 6 App Showcases on Laptop Screen (p: 0.78 -> 0.94)
    if (p >= 0.78 && p <= 0.94) {
      const laptopSlideProgress = Math.min(1.0, Math.max(0.0, (p - 0.78) / 0.16));
      const currentLaptopIdx = Math.min(5, Math.floor(laptopSlideProgress * 6));
      const activeLaptopTex = laptopTextures[currentLaptopIdx];

      if (laptopScreenMaterial.map !== activeLaptopTex) {
        laptopScreenMaterial.map = activeLaptopTex;
        laptopScreenMaterial.needsUpdate = true;
      }
    }

    // Expose refs for headless testing
    if (typeof window !== 'undefined') {
      (window as any).THREE = THREE;
      (window as any).__STUDIO = {
        phone: phoneRef.current,
        rings: ringsRef.current,
        laptopHinge: laptopHingeRef.current,
        laptopLid: laptopLidRef.current,
        laptopBase: laptopBaseRef.current,
        laptop: laptopRef.current,
        phoneScreenMat: phoneScreenMaterial,
        laptopScreenMat: laptopScreenMaterial,
      };
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.0}>
      <primitive object={clonedScene} />

      {/* Precision Sacred Geometry Harmonic Rings & 4 Product Signal Nodes (3:5:6 Gyroscope) */}
      <mesh ref={harmonicInnerRingRef} position={[0, 0, -0.12]}>
        <torusGeometry args={[2.02, 0.009, 16, 128]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#DCB0FF"
          emissiveIntensity={2.8}
          transparent
          opacity={0.75}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={harmonicMidRingRef} position={[0, 0, -0.22]}>
        <torusGeometry args={[2.95, 0.011, 16, 128]} />
        <meshStandardMaterial
          color="#F3E8FF"
          emissive="#9D4EDD"
          emissiveIntensity={2.4}
          transparent
          opacity={0.65}
          toneMapped={false}
        />
      </mesh>

      {/* 4 Orbiting Product Signal Nodes: Pagelit, AR Explorer, The System, Battle Cows */}
      <group ref={signalNodesGroupRef} position={[0, 0, -0.15]}>
        {/* Pagelit — Cyan Signal Node (Top Right on 2.02 ring) */}
        <mesh position={[1.428, 1.428, 0.08]}>
          <octahedronGeometry args={[0.048, 1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#00E5FF"
            emissiveIntensity={3.8}
            toneMapped={false}
          />
        </mesh>
        {/* AR Explorer — Electric Sky Signal Node (Bottom Left on 2.02 ring) */}
        <mesh position={[-1.428, -1.428, -0.08]}>
          <octahedronGeometry args={[0.048, 1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#38BDF8"
            emissiveIntensity={3.8}
            toneMapped={false}
          />
        </mesh>
        {/* The System — Amber Gold Signal Node (Top Left on 2.95 ring) */}
        <mesh position={[-2.086, 2.086, 0.12]}>
          <octahedronGeometry args={[0.058, 1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#F59E0B"
            emissiveIntensity={3.8}
            toneMapped={false}
          />
        </mesh>
        {/* Battle Cows — Emerald Signal Node (Bottom Right on 2.95 ring) */}
        <mesh position={[2.086, -2.086, -0.12]}>
          <octahedronGeometry args={[0.058, 1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#10B981"
            emissiveIntensity={3.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Balanced Studio Key & Rim Lights */}
      <spotLight
        ref={spotKeyRef}
        position={[0, 4.0, 4.2]}
        intensity={0.05}
        angle={0.65}
        penumbra={0.8}
        color="#FFFFFF"
      />
      <spotLight
        ref={spotRimRightRef}
        position={[4.8, 1.2, 3.2]}
        intensity={0.02}
        angle={0.55}
        penumbra={0.7}
        color="#DCB0FF"
      />
      <spotLight
        ref={spotRimLeftRef}
        position={[-2.2, 2.5, 2.8]}
        intensity={0.02}
        angle={0.85}
        penumbra={0.7}
        color="#F5EEFF"
      />
      <pointLight
        ref={pointAbyssRef}
        position={[0, -2.5, -1.5]}
        intensity={0.0}
        color="#00E5FF"
      />
      {/* Dedicated studio key light focused on laptop */}
      <spotLight
        ref={spotLaptopRef}
        position={[-3.2, 3.2, 2.8]}
        intensity={0.05}
        angle={0.85}
        penumbra={0.7}
        color="#F0E8FF"
      />
      {/* Dedicated close-range fill light for laptop casing & screen */}
      <pointLight
        ref={laptopScreenLightRef}
        position={[-3.20, 1.40, 1.60]}
        intensity={0.0}
        color="#F0E8FF"
        distance={6.0}
        decay={1.5}
      />
      {/* Studio rim light catching laptop edges & hinge highlights */}
      <pointLight
        position={[-4.5, 0.8, -0.4]}
        intensity={1.5}
        color="#DCB0FF"
        distance={5.0}
        decay={1.8}
      />
    </group>
  );
};
