import { FC, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export type ARScanMode = 'pointcloud' | 'wireframe' | 'heatmap';

interface ARModelProps {
  scanMode: ARScanMode;
}

const ARHologramMesh: FC<ARModelProps> = ({ scanMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const laserRingRef = useRef<THREE.Mesh>(null);

  // Generate 1200 point-cloud vertices for LiDAR mode
  const { pointPositions, pointColors } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorCyan = new THREE.Color('#00E5FF');
    const colorSky = new THREE.Color('#38BDF8');
    const colorPurple = new THREE.Color('#A855F7');

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere surface + some interior depth
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + 5 ** 0.5) * (i + 0.5);
      const radius = 1.35 + (Math.random() - 0.5) * 0.25;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation based on Y coordinate
      const mixed = (y + 1.5) / 3;
      const c = mixed > 0.6 ? colorCyan : mixed > 0.3 ? colorSky : colorPurple;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { pointPositions: positions, pointColors: colors };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Rotate main geometry
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.5;
      wireRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.3;
      pointsRef.current.rotation.z = Math.cos(t * 0.3) * 0.15;
    }

    // Move laser scanning plane up and down
    if (laserRingRef.current) {
      laserRingRef.current.position.y = Math.sin(t * 1.6) * 1.4;
      laserRingRef.current.rotation.z += delta * 1.2;
    }
  });

  return (
    <group>
      {/* 1. Spatial LiDAR Point Cloud Mode */}
      {scanMode === 'pointcloud' && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[pointPositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[pointColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            vertexColors
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* 2. Spatial Wireframe Mode */}
      {scanMode === 'wireframe' && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh ref={meshRef}>
            <torusKnotGeometry args={[1.0, 0.32, 100, 16]} />
            <meshStandardMaterial
              color="#00E5FF"
              wireframe
              emissive="#00E5FF"
              emissiveIntensity={0.6}
              transparent
              opacity={0.75}
            />
          </mesh>
          <mesh scale={0.96}>
            <torusKnotGeometry args={[1.0, 0.32, 100, 16]} />
            <meshBasicMaterial
              color="#031A38"
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      )}

      {/* 3. Depth Heatmap Occlusion Mode */}
      {scanMode === 'heatmap' && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[1.35, 3]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.1}
              metalness={0.9}
              emissive="#0055FF"
              emissiveIntensity={0.5}
              wireframe={false}
            />
          </mesh>
          <mesh ref={wireRef as any} scale={1.02}>
            <icosahedronGeometry args={[1.35, 3]} />
            <meshBasicMaterial
              color="#00E5FF"
              wireframe
              transparent
              opacity={0.4}
            />
          </mesh>
        </Float>
      )}

      {/* Sweeping Laser Plane Ring */}
      <mesh ref={laserRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.58, 64]} />
        <meshBasicMaterial
          color="#00E5FF"
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ground Projection Target Radar Grid */}
      <mesh position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial
          color="#00E5FF"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};

interface ARSpatialViewerProps {
  scanMode: ARScanMode;
}

export const ARSpatialViewer: FC<ARSpatialViewerProps> = ({ scanMode }) => {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#041226]/80 to-[#020914]/90">
      {/* 3D WebGL Canvas */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#38BDF8" />
        <pointLight position={[-4, -2, 2]} intensity={2.0} color="#00E5FF" />
        <ARHologramMesh scanMode={scanMode} />
      </Canvas>

      {/* Spatial HUD Watermark */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
        <span>WEBGL 3D SPATIAL SCAN // {scanMode.toUpperCase()}</span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none text-[10px] font-mono text-white/40">
        <span>{isInteracting ? 'ACTIVE ROTATION' : 'DRAG TO ROTATE'}</span>
      </div>
    </div>
  );
};
