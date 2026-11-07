import { FC, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

// Atmospheric color profiles per section
const ATMOSPHERE_PALETTES = [
  // Scene 0: Genesis (Studio Deep Purple & Luminous Lavender)
  { top: '#2C115F', bottom: '#070212', accent: '#DCB0FF', particle: '#DCB0FF', lightPos: [0, 4, 3] },
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
  const bokehRef = useRef<THREE.Points>(null);
  const auraCoreRef = useRef<THREE.Mesh>(null);
  const auraOuterRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  // Procedural soft circular glow texture so particles & volumetric aura are silky-smooth orbs (never square pixels)
  const softOrbTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, 'rgba(235, 210, 255, 0.75)');
      grad.addColorStop(0.6, 'rgba(180, 120, 255, 0.20)');
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Tier 1: 550 Deep-Space Stardust particles
  const particleCount = 550;
  const { positions, originalY } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const origY = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 1.5;
      origY[i] = pos[i * 3 + 1];
    }
    return { positions: pos, originalY: origY };
  }, []);

  // Tier 2: 95 Foreground Spatial Bokeh Motes around the studio stage
  const bokehCount = 95;
  const { bokehPositions, bokehOriginalX, bokehOriginalY } = useMemo(() => {
    const pos = new Float32Array(bokehCount * 3);
    const origX = new Float32Array(bokehCount);
    const origY = new Float32Array(bokehCount);
    for (let i = 0; i < bokehCount; i++) {
      // Distributed in an atmospheric halo around center stage
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 6.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.75;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
      origX[i] = pos[i * 3];
      origY[i] = pos[i * 3 + 1];
    }
    return { bokehPositions: pos, bokehOriginalX: origX, bokehOriginalY: origY };
  }, []);

  useFrame((state, delta) => {
    const target = ATMOSPHERE_PALETTES[activeSceneIndex] || ATMOSPHERE_PALETTES[0];
    const lerpSpeed = Math.min(1, delta * 2.5);
    const p = Math.min(1.0, Math.max(0.0, scrollProgress));
    const time = state.clock.getElapsedTime();

    // Dynamic light multiplier: strong atmospheric presence at intro, blackout at p>=0.95
    let lightMultiplier = 1.0;
    if (p < 0.14) {
      lightMultiplier = THREE.MathUtils.lerp(0.65, 1.0, Math.min(1.0, p / 0.12));
    } else if (p > 0.95) {
      lightMultiplier = THREE.MathUtils.lerp(1.0, 0.0, Math.min(1.0, (p - 0.95) / 0.05));
    }

    // Smoothly interpolate ambient & spot light colors & intensities
    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(new THREE.Color(target.top), lerpSpeed);
      ambientLightRef.current.intensity = 0.65 * lightMultiplier;
    }
    if (spotLightRef.current) {
      spotLightRef.current.color.lerp(new THREE.Color(target.accent), lerpSpeed);
      spotLightRef.current.intensity = 1.4 * lightMultiplier;

      spotLightRef.current.position.x = THREE.MathUtils.lerp(
        spotLightRef.current.position.x,
        target.lightPos[0] + pointer.x * 2.2,
        lerpSpeed
      );
      spotLightRef.current.position.y = THREE.MathUtils.lerp(
        spotLightRef.current.position.y,
        target.lightPos[1] + pointer.y * 1.6,
        lerpSpeed
      );
    }

    // Volumetric Studio Aura behind the Medallion & Rings
    // Prominent during the Intro (p < 0.18), subtly shifts to follow active showcase
    const introFocus = 1.0 - THREE.MathUtils.smoothstep(p, 0.10, 0.24);
    if (auraCoreRef.current) {
      const mat = auraCoreRef.current.material as THREE.MeshBasicMaterial;
      mat.color.lerp(new THREE.Color(target.accent), lerpSpeed);
      const pulse = 1.0 + Math.sin(time * 1.4) * 0.06;
      auraCoreRef.current.scale.setScalar(7.8 * pulse);
      auraCoreRef.current.position.x = THREE.MathUtils.lerp(auraCoreRef.current.position.x, pointer.x * 0.45, lerpSpeed);
      auraCoreRef.current.position.y = THREE.MathUtils.lerp(auraCoreRef.current.position.y, pointer.y * 0.35, lerpSpeed);
      mat.opacity = THREE.MathUtils.lerp(0.08, 0.26, introFocus) * lightMultiplier;
    }
    if (auraOuterRef.current) {
      const mat = auraOuterRef.current.material as THREE.MeshBasicMaterial;
      mat.color.lerp(new THREE.Color(target.top), lerpSpeed);
      const slowPulse = 1.0 + Math.cos(time * 0.9) * 0.05;
      auraOuterRef.current.scale.setScalar(14.5 * slowPulse);
      mat.opacity = THREE.MathUtils.lerp(0.18, 0.48, introFocus) * lightMultiplier;
    }

    // Tier 1: Deep-Space Stardust upward drift
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] = originalY[i] + Math.sin(time * 0.45 + i) * 0.35 - p * 4.5;
        if (arr[i * 3 + 1] < -10) {
          arr[i * 3 + 1] += 20;
        }
      }
      posAttr.needsUpdate = true;
      particlesRef.current.rotation.y = pointer.x * 0.05 + time * 0.012;
      particlesRef.current.rotation.x = -pointer.y * 0.03;
    }

    // Tier 2: Foreground Spatial Bokeh with cursor parallax & orbital swirl
    if (bokehRef.current) {
      const posAttr = bokehRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < bokehCount; i++) {
        arr[i * 3] = bokehOriginalX[i] + Math.cos(time * 0.6 + i * 0.7) * 0.25 + pointer.x * 0.35;
        arr[i * 3 + 1] = bokehOriginalY[i] + Math.sin(time * 0.5 + i * 0.9) * 0.25 + pointer.y * 0.25;
      }
      posAttr.needsUpdate = true;
      bokehRef.current.rotation.z = time * 0.025;
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.4} />
      <spotLight
        ref={spotLightRef}
        position={[0, 4, 3]}
        angle={0.65}
        penumbra={0.9}
        intensity={0.8}
      />

      {/* Volumetric Studio Nebula Aura (Outer Deep Purple Pool + Inner Lavender Core) */}
      <mesh ref={auraOuterRef} position={[0, 0, -3.2]} renderOrder={-2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={softOrbTexture}
          color="#2C115F"
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={auraCoreRef} position={[0, 0, -2.6]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={softOrbTexture}
          color="#DCB0FF"
          transparent
          opacity={0.24}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Tier 1: Deep-Space Silky Stardust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={softOrbTexture}
          size={0.09}
          color="#DCB0FF"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Tier 2: Foreground Spatial Bokeh Motes */}
      <points ref={bokehRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bokehPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={softOrbTexture}
          size={0.22}
          color="#F3E8FF"
          transparent
          opacity={0.40}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};
