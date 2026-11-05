import { FC, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { AtmosphereBackground } from './AtmosphereBackground';

export const SceneManager: FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 w-full h-full">
      <Canvas
        dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        <Suspense fallback={null}>
          <AtmosphereBackground />

          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.45}
              luminanceSmoothing={0.3}
              intensity={0.7}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
