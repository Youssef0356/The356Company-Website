# 09 — 3D GRAPHICS, SHADERS & ANIMATION CHOREOGRAPHY

> **Document Status:** Verified & Approved  
> **Skill Integration:** `threejs-react-three-fiber`, `r3f-materials`, `gsap-scrolltrigger`  
> **Standards:** PBR Physically Based Rendering, Selective Bloom, Instanced Mesh Optimization

---

## 1. Materials & PBR Lighting Strategy

In accordance with the `r3f-materials` skill, material properties are calibrated to maximize tactile quality while staying strictly within WebGL performance budgets.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             PBR MATERIAL SPECIFICATIONS                                │
├──────────────────┬───────────────────────────────┬─────────────────┬───────────────────┤
│ Surface          │ Material Class                │ PBR Values      │ Visual Effect     │
├──────────────────┼───────────────────────────────┼─────────────────┼───────────────────┤
│ Phone Glass      │ MeshPhysicalMaterial          │ rough: 0.05     │ Crisp reflection, │
│ (AR Explorer)    │                               │ trans: 0.92     │ refraction index  │
│                  │                               │ ior: 1.52       │ 1.52 (Gorilla)    │
├──────────────────┼───────────────────────────────┼─────────────────┼───────────────────┤
│ Digital Pages    │ MeshStandardMaterial          │ rough: 0.65     │ Soft parchment,   │
│ (Pagelit)        │                               │ metal: 0.0      │ double-sided,     │
│                  │                               │ side: DoubleSide│ zero glare        │
├──────────────────┼───────────────────────────────┼─────────────────┼───────────────────┤
│ Secret Cards     │ MeshStandardMaterial +        │ rough: 0.28     │ Metallic foil,    │
│ (The System)     │ Anisotropic Specular Map      │ metal: 0.85     │ embossed gold     │
├──────────────────┼───────────────────────────────┼─────────────────┼───────────────────┤
│ Hex Tiles        │ MeshStandardMaterial          │ rough: 0.40     │ Tactile cartoon   │
│ (Battle Cows)    │ (InstancedMesh, 50 instances) │ metal: 0.05     │ plastic/clay look │
└──────────────────┴───────────────────────────────┴─────────────────┴───────────────────┘
```

---

## 2. Dynamic Scene Lighting Crossfader

Rather than re-initializing light fixtures on every section, the scene uses a unified **Lighting Rig** that smoothly interpolates color and intensity based on the active section index:

```typescript
// src/components/canvas/Lighting.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '../../stores/useExperienceStore';

const SCENE_LIGHT_CONFIGS = [
  // Scene 01: Genesis (Cosmic Deep Purple)
  { ambient: '#2C115F', intensity: 0.8, spotColor: '#DCB0FF', spotIntensity: 3.5, spotPos: [0, 5, 5] },
  // Scene 02: AR Explorer (Cobalt & Cyan)
  { ambient: '#0A192F', intensity: 1.0, spotColor: '#38BDF8', spotIntensity: 4.5, spotPos: [2, 6, 4] },
  // Scene 03: Pagelit (Clean Day White & Cyan)
  { ambient: '#1E1B4B', intensity: 1.2, spotColor: '#00E5FF', spotIntensity: 5.0, spotPos: [-2, 5, 4] },
  // Scene 04: The System (Noir Table Amber)
  { ambient: '#180B02', intensity: 0.4, spotColor: '#F59E0B', spotIntensity: 6.0, spotPos: [0, 4, 2] },
  // Scene 05: Battle Cows (Lush Meadow Sunlight)
  { ambient: '#064E3B', intensity: 1.4, spotColor: '#FDE047', spotIntensity: 5.5, spotPos: [3, 7, 5] },
  // Scene 06: Ecosystem (Radiant Purple Finale)
  { ambient: '#2C115F', intensity: 1.5, spotColor: '#FFFFFF', spotIntensity: 6.0, spotPos: [0, 8, 8] },
];

export const Lighting: React.FC = () => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const activeIndex = useExperienceStore((s) => s.activeSceneIndex);

  useFrame((_, delta) => {
    const target = SCENE_LIGHT_CONFIGS[activeIndex] || SCENE_LIGHT_CONFIGS[0];
    const lerpSpeed = delta * 2.5;

    if (ambientRef.current) {
      ambientRef.current.color.lerp(new THREE.Color(target.ambient), lerpSpeed);
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, target.intensity, lerpSpeed);
    }
    if (spotRef.current) {
      spotRef.current.color.lerp(new THREE.Color(target.spotColor), lerpSpeed);
      spotRef.current.intensity = THREE.MathUtils.lerp(spotRef.current.intensity, target.spotIntensity, lerpSpeed);
      spotRef.current.position.lerp(new THREE.Vector3(...target.spotPos), lerpSpeed);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      <spotLight ref={spotRef} castShadow angle={0.45} penumbra={0.8} />
    </>
  );
};
```

---

## 3. Custom Procedural Shaders

### 3.1. Spatial AR Laser Plane Shader (AR Explorer)
Renders a glowing polar/cartesian grid that fades gracefully toward its outer boundary, creating a real-time hologram floor anchor:

```glsl
// LaserGridShader.frag
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
  float line = min(grid.x, grid.y);
  float c = 1.0 - min(line, 1.0);

  // Radial falloff so edges vanish softly into void
  float dist = distance(vUv, vec2(0.5));
  float alpha = smoothstep(0.5, 0.05, dist) * c;

  // Subtle laser scan pulse traveling outward
  float pulse = sin(dist * 30.0 - uTime * 4.0) * 0.2 + 0.8;

  gl_FragColor = vec4(uColor * pulse, alpha * 0.85);
}
```

### 3.2. Secret Foil Card Hologram Shader (The System)
Applies a rainbow iridescent sheen to the gold-embossed details when viewed at glancing angles:

```glsl
// FoilCardShader.frag
uniform sampler2D uEmbossMap;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
  
  // Spectral chromatic dispersion
  vec3 foilColor = vec3(
    sin(fresnel * 6.28 + 0.0) * 0.5 + 0.5,
    sin(fresnel * 6.28 + 2.0) * 0.5 + 0.5,
    sin(fresnel * 6.28 + 4.0) * 0.5 + 0.5
  );

  gl_FragColor = vec4(foilColor, fresnel * 0.7);
}
```

---

## 4. Animation Synchronization with R3F `useFrame`

To link GSAP ScrollTrigger's progress directly with Three.js without causing React component re-renders:

```typescript
// src/components/canvas/scenes/ARExplorerScene.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '../../../stores/useExperienceStore';

export const ARExplorerScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const phoneRef = useRef<THREE.Mesh>(null);
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Normalized AR Explorer scene scrub range: 0.15 to 0.35
    const localT = THREE.MathUtils.clamp((scrollProgress - 0.15) / 0.20, 0, 1);

    // Smoothly interpolate rotation from dramatic angle to face-on
    if (phoneRef.current) {
      phoneRef.current.rotation.x = THREE.MathUtils.lerp(0.45, 0.0, localT);
      phoneRef.current.rotation.y = THREE.MathUtils.lerp(-0.55, 0.0, localT);
      phoneRef.current.position.z = THREE.MathUtils.lerp(-1.0, 1.2, localT);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Phone Chassis & Screen */}
      <mesh ref={phoneRef} position={[0, 0, 0]}>
        {/* Phone Geometry & Screen Texture */}
      </mesh>
    </group>
  );
};
```
