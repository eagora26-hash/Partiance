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
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
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
  const target = useRef({ speed: 0.35, emissive: 3.4 });
  useEffect(() => {
    if (state === 'LOADING') target.current = { speed: 1.6, emissive: 5.5 };
    else if (state === 'HOVER') target.current = { speed: 0.35, emissive: 4.4 };
    else target.current = { speed: 0.35, emissive: 3.4 };

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
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 4, 3]} intensity={2.4} />
      <directionalLight position={[-3, 1, 2]} intensity={0.5} color="#9FD8E8" />
      <pointLight position={[-2, 2.6, -3]} intensity={6} color="#22E3D6" />
      <Suspense fallback={null}>
        <HeroObject state={state} />
        <Environment preset="night" environmentIntensity={0.3} />
        <ContactShadows position={[0, -1.4, 0]} opacity={0.35} blur={2.8} scale={7} />
      </Suspense>
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.65}
          luminanceSmoothing={0.3}
          mipmapBlur
          radius={0.5}
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

  return (
    <div
      className={className}
      style={{ width: '100%', height }}
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
        gl={{ alpha: true, antialias: true }}
      >
        <Scene state={state} />
      </Canvas>
    </div>
  );
}

export default PartianceHero;

useGLTF.preload(GLB_URL);
