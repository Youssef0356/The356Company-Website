import { FC, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

interface ShardData {
  initialPos: THREE.Vector3;
  scatterDir: THREE.Vector3;
  rotationAxis: THREE.Vector3;
  rotationSpeed: number;
  scale: number;
  geoIndex: number;
  isLeadWipeShard?: boolean;
}

export const FractureCluster: FC<{ focalPoint?: [number, number, number] }> = ({
  focalPoint = [-3.1, 0.1, 0.4],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shardMeshesRef = useRef<(THREE.Mesh | null)[]>([]);

  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  // Diverse polyhedra geometries for authentic voronoi / fractured look
  const geometries = useMemo(() => {
    return [
      new THREE.TetrahedronGeometry(0.32, 0),
      new THREE.OctahedronGeometry(0.28, 0),
      new THREE.DodecahedronGeometry(0.25, 0),
      new THREE.IcosahedronGeometry(0.22, 0),
      new THREE.ConeGeometry(0.26, 0.45, 4),
    ];
  }, []);

  // Generate 22 fracture shards clustered around the focal element
  const shards = useMemo<ShardData[]>(() => {
    const list: ShardData[] = [];
    const count = 22;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.35 + (i % 4) * 0.18;
      const height = ((i % 5) - 2) * 0.22;

      // Tight initial offset
      const initialPos = new THREE.Vector3(
        focalPoint[0] + Math.cos(angle) * radius,
        focalPoint[1] + height,
        focalPoint[2] + Math.sin(angle) * radius
      );

      // Explosive outward scatter vector
      const scatterDir = new THREE.Vector3(
        Math.cos(angle) * (1.8 + Math.random() * 1.5),
        height * 2.5 + (Math.random() - 0.5) * 1.8,
        Math.sin(angle) * (1.8 + Math.random() * 1.5)
      ).normalize();

      list.push({
        initialPos,
        scatterDir,
        rotationAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize(),
        rotationSpeed: 3.0 + Math.random() * 5.0,
        scale: 0.65 + Math.random() * 0.6,
        geoIndex: i % geometries.length,
        isLeadWipeShard: i === 0, // Shard 0 is the camera-occluding wipe shard
      });
    }

    return list;
  }, [focalPoint, geometries]);

  // Materials: Deep obsidian with glowing violet neon inner fracture
  const obsidianMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0A0414'),
        roughness: 0.18,
        metalness: 0.92,
      }),
    []
  );

  const neonShardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1A0830'),
        emissive: new THREE.Color('#DCB0FF'),
        emissiveIntensity: 1.2,
        roughness: 0.22,
        metalness: 0.85,
      }),
    []
  );

  // Blackout Wipe Material (Pure solid obsidian for lens occlusion)
  const wipeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#05020A'),
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    const p = scrollProgress;

    // Disassembly takes place from p = 0.55 to 0.88
    const explodeT = Math.min(1.0, Math.max(0.0, (p - 0.55) / 0.28));
    const easedExplode = Math.pow(explodeT, 1.8);

    // Visible only when user scrolls past 0.40
    if (groupRef.current) {
      groupRef.current.visible = p >= 0.40;
    }

    shardMeshesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const data = shards[idx];

      if (data.isLeadWipeShard) {
        // LEAD SHARD: Screams directly toward the camera lens from p = 0.75 -> 0.90!
        if (p < 0.75) {
          // In position with slight breathing
          const scatterDist = easedExplode * 1.2;
          mesh.position.copy(data.initialPos).addScaledVector(data.scatterDir, scatterDist);
          mesh.scale.setScalar(data.scale * Math.min(1.0, (p - 0.40) / 0.15));
        } else {
          // Target camera near plane
          const wipeProgress = Math.min(1.0, (p - 0.75) / 0.14);
          const easedWipe = THREE.MathUtils.smoothstep(wipeProgress, 0.0, 1.0);

          // Fly from initial scatter point right to camera front plane
          const camTargetPos = state.camera.position.clone();
          const camDir = new THREE.Vector3();
          state.camera.getWorldDirection(camDir);

          // Position just 0.15 units directly in front of the camera lens
          const lensFrontPos = camTargetPos.clone().addScaledVector(camDir, 0.2);

          mesh.position.lerpVectors(data.initialPos, lensFrontPos, easedWipe);

          // Face the camera directly
          mesh.lookAt(camTargetPos);

          // Exponential scale up to cover 100% of the screen
          const wipeScale = THREE.MathUtils.lerp(1.0, 32.0, Math.pow(easedWipe, 2.0));
          mesh.scale.setScalar(wipeScale);
        }
      } else {
        // GENERAL SHARDS: Explode outward and tumble
        const scatterDist = easedExplode * 4.2;
        mesh.position.copy(data.initialPos).addScaledVector(data.scatterDir, scatterDist);

        // Continuous tumbling rotation
        mesh.rotateOnAxis(data.rotationAxis, data.rotationSpeed * (0.01 + easedExplode * 0.08));

        // Scale fades in around 0.40 and disappears after full blackout (> 0.92)
        const appearScale = Math.min(1.0, Math.max(0.0, (p - 0.40) / 0.12));
        const disappearScale = p > 0.90 ? Math.max(0.0, 1.0 - (p - 0.90) / 0.08) : 1.0;
        mesh.scale.setScalar(data.scale * appearScale * disappearScale);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shards.map((shard, idx) => (
        <mesh
          key={idx}
          ref={(el) => (shardMeshesRef.current[idx] = el)}
          geometry={geometries[shard.geoIndex]}
          material={
            shard.isLeadWipeShard
              ? wipeMaterial
              : idx % 3 === 0
              ? neonShardMaterial
              : obsidianMaterial
          }
          position={shard.initialPos}
        />
      ))}
    </group>
  );
};
