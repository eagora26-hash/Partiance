// =============================================================================
//  <PartianceHero /> — THE landing-page hero object (REAL 3D).
//  The animated Partiance logo (interlocked links + real 3D "Partiance" wordmark)
//  is the centerpiece: it rotates continuously (idle), spins faster while loading,
//  and micro-tilts on hover. Driven by public/Partiance.glb via an AnimationMixer.
//  Falls back to public/Partiance-fallback.svg when WebGL is unavailable.
//
//  Canonical brand source: /branding/partiance (Partiance.glb / .blend).
// =============================================================================
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

type HeroState = 'IDLE' | 'LOADING' | 'HOVER';

const GLB_URL = '/Partiance.glb';

function webglOK() {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// ---- The rotating hero mesh + state-driven animation ----
function HeroObject({ state }: { state: HeroState }) {
  const { scene, animations } = useGLTF(GLB_URL);
  const root = useRef<THREE.Group>(null);
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const actions = useMemo(() => {
    const m: Record<string, THREE.AnimationAction> = {};
    animations.forEach((c) => (m[c.name] = mixer.clipAction(c)));
    return m;
  }, [animations, mixer]);

  // Spin speed + cyan emissive intensity per state. Applied continuously (lerped),
  // not just via clips, so IDLE<->LOADING transitions stay smooth.
  // Emissive kept deliberately restrained: the ring should read as luminous metal,
  // never a blown-out blob — its geometry must stay legible. The (light) bloom pass
  // adds the halo, so the material itself doesn't need to clip to white.
  const target = useRef({ speed: 0.35, emissive: 1.5 });
  useEffect(() => {
    if (state === 'LOADING') target.current = { speed: 1.6, emissive: 2.3 };
    else if (state === 'HOVER') target.current = { speed: 0.35, emissive: 1.9 };
    else target.current = { speed: 0.35, emissive: 1.5 };

    // Play the hover micro-tilt clip once when entering HOVER.
    if (state === 'HOVER' && actions['hover']) {
      const a = actions['hover'];
      a.reset();
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = false;
      a.play();
    }
  }, [state, actions]);

  const spin = useRef(0.35);
  const tilt = useRef(0);
  useFrame((_, dt) => {
    mixer.update(dt);
    // Lerp the spin speed toward target -> smooth idle<->loading transition.
    spin.current += (target.current.speed - spin.current) * Math.min(1, dt * 3);
    if (root.current) {
      root.current.rotation.y += spin.current * dt;
      // Hover micro-tilt on X.
      const wantTilt = state === 'HOVER' ? -0.12 : 0;
      tilt.current += (wantTilt - tilt.current) * Math.min(1, dt * 6);
      root.current.rotation.x = tilt.current;
    }
    // Drive the cyan emissive (the Alliance link glows brighter while loading/hover).
    scene.traverse((o: THREE.Object3D) => {
      const mesh = o as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (
        mesh.isMesh &&
        mat &&
        mat.emissive &&
        mat.emissiveIntensity !== undefined
      ) {
        const isCyan = mat.name?.includes('Cyan') || mat.emissive.g > 0.4;
        if (isCyan) {
          mat.emissiveIntensity +=
            (target.current.emissive - mat.emissiveIntensity) * Math.min(1, dt * 4);
        }
      }
    });
  });

  return <primitive ref={root} object={scene} scale={2.4} position={[0, 0.2, 0]} />;
}

function Scene({ state }: { state: HeroState }) {
  return (
    <>
      {/* Lighting tuned to sculpt the graphite Partner link without flooding the
          frame — no ground plane / contact shadows, so nothing paints a visible
          rectangle. The only bright element is the cyan ring itself. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 3]} intensity={1.8} />
      <directionalLight position={[-3, 1, 2]} intensity={0.45} color="#9FD8E8" />
      <pointLight position={[-2, 2.4, -3]} intensity={3} color="#22E3D6" distance={9} decay={2} />
      <Suspense fallback={null}>
        <HeroObject state={state} />
        {/* Image-based lighting only — never rendered as a background. */}
        <Environment preset="night" environmentIntensity={0.35} />
      </Suspense>
      {/* Refined bloom: a high luminance threshold means only the cyan ring's hot
          core blooms, so the halo stays tight and the geometry reads clearly. */}
      <EffectComposer>
        <Bloom
          intensity={0.42}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.35}
        />
      </EffectComposer>
    </>
  );
}

export interface PartianceHeroProps {
  /** Drive the LOADING state (faster spin + stronger glow) from your app. */
  loading?: boolean;
  /** Hero canvas height. */
  height?: number | string;
  className?: string;
}

export function PartianceHero({ loading = false, height = '100%', className }: PartianceHeroProps) {
  const [ok, setOk] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    setOk(webglOK());
  }, []);

  const state: HeroState = loading ? 'LOADING' : hovered ? 'HOVER' : 'IDLE';

  if (!ok) {
    // SVG fallback — same identity, no WebGL.
    return (
      <div className={className} style={{ width: '100%', height, display: 'grid', placeItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Partiance-fallback.svg" alt="Partiance" style={{ width: 320, maxWidth: '70%' }} />
      </div>
    );
  }

  // Feather the canvas region into the page on every edge. The canvas is
  // transparent (alpha), but the *lit* object still has a soft footprint; this
  // elliptical mask dissolves that footprint toward the edges so there is no
  // rectangular boundary — while keeping a wide, fully-opaque core so the logo
  // and wordmark are never clipped. Taller than wide to match the lockup.
  const featherMask =
    'radial-gradient(78% 92% at 50% 46%, #000 70%, rgba(0,0,0,0.55) 84%, transparent 100%)';

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height,
        WebkitMaskImage: featherMask,
        maskImage: featherMask,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label="Partiance"
      role="img"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 4.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 0.92;
        }}
      >
        <Scene state={state} />
      </Canvas>
    </div>
  );
}

export default PartianceHero;

useGLTF.preload(GLB_URL);
