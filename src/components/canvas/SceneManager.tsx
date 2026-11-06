import { FC, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { AtmosphereBackground } from './AtmosphereBackground';
import { StudioCore } from './StudioCore';
import { CameraRig } from './CameraRig';

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
          <CameraRig />
          <AtmosphereBackground />
          <StudioCore />

          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.78}
              luminanceSmoothing={0.2}
              intensity={0.65}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.25} darkness={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
