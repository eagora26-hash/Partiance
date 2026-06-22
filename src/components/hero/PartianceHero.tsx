// =============================================================================
//  <PartianceHero /> — THE landing-page hero object (REAL 3D).
//  The animated Partiance logo (interlocked links + real 3D "Partiance" wordmark)
//  is the centerpiece. It plays a cinematic ONE-TIME intro on first load
//  (assemble → metallic light sweep → a single burst of teal energy sparks that
//  then vanish completely → settle into a slow, elegant idle rotation), and after
//  that simply rotates slowly with a micro-tilt on hover. No persistent particles.
//  Driven by public/Partiance.glb via an AnimationMixer.
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
type Phase = 'INTRO' | 'LIVE';

const GLB_URL = '/Partiance.glb';
const INTRO_FLAG = 'partiance:hero-intro-played';
const INTRO_DURATION = 2.6; // seconds — the whole reveal

function webglOK() {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** smootherstep — C2-continuous ease, used to shape the intro envelope. */
function smoother(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

// -----------------------------------------------------------------------------
//  Energy sparks — a ONE-TIME teal particle burst, shown ONLY during the reveal.
//  They emit outward from the logo on a short, eased timeline, then fade to zero
//  and the whole points object is unmounted. Nothing persists into the idle state.
// -----------------------------------------------------------------------------
const SPARK_COUNT = 120;

function EnergySparks({ play, onDone }: { play: boolean; onDone: () => void }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const t = useRef(0);
  const done = useRef(false);

  // Per-spark launch direction + speed + size, generated once.
  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(SPARK_COUNT * 3);
    const velocities = new Float32Array(SPARK_COUNT * 3);
    const sizes = new Float32Array(SPARK_COUNT);
    for (let i = 0; i < SPARK_COUNT; i++) {
      // Bias the burst toward a ring around the mark (xy plane) with slight z spread.
      const a = Math.random() * Math.PI * 2;
      const r = 0.15 + Math.random() * 0.35;
      const speed = 0.7 + Math.random() * 1.7;
      const dx = Math.cos(a);
      const dy = Math.sin(a) * 0.9 + 0.15;
      const dz = (Math.random() - 0.5) * 0.5;
      positions[i * 3] = dx * r;
      positions[i * 3 + 1] = dy * r + 0.1;
      positions[i * 3 + 2] = dz * r;
      velocities[i * 3] = dx * speed;
      velocities[i * 3 + 1] = dy * speed;
      velocities[i * 3 + 2] = dz * speed;
      sizes[i] = 0.02 + Math.random() * 0.05;
    }
    return { positions, velocities, sizes };
  }, []);

  // Soft round teal sprite (radial alpha) so sparks read as glowing energy, not squares.
  const sprite = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(180,255,248,1)');
    g.addColorStop(0.35, 'rgba(64,248,224,0.85)');
    g.addColorStop(0.7, 'rgba(20,200,188,0.25)');
    g.addColorStop(1, 'rgba(20,200,188,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame((_, dt) => {
    if (!play || done.current || !points.current || !mat.current) return;
    t.current += dt;
    // Burst is brief: emit for ~0.5s of ease, fully gone by ~1.4s.
    const life = Math.min(1, t.current / 1.4);
    const expand = smoother(Math.min(1, t.current / 0.9));

    const arr = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < SPARK_COUNT; i++) {
      const drag = 1 - expand * 0.55; // sparks decelerate as they fly out
      arr[i * 3] = positions[i * 3] + velocities[i * 3] * expand * drag;
      arr[i * 3 + 1] =
        positions[i * 3 + 1] + velocities[i * 3 + 1] * expand * drag - expand * expand * 0.25;
      arr[i * 3 + 2] = positions[i * 3 + 2] + velocities[i * 3 + 2] * expand * drag;
    }
    points.current.geometry.attributes.position.needsUpdate = true;

    // Quick flash up, long fade to ZERO — no residue.
    const rise = smoother(Math.min(1, t.current / 0.18));
    mat.current.opacity = rise * (1 - life) * (1 - life);

    if (life >= 1) {
      done.current = true;
      mat.current.opacity = 0;
      onDone();
    }
  });

  if (!play) return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        map={sprite}
        size={0.16}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0}
        color="#7bfff0"
      />
    </points>
  );
}

// -----------------------------------------------------------------------------
//  The hero mesh + state-driven animation.
//  `phase` controls the one-time intro envelope; `state` controls live behaviour.
// -----------------------------------------------------------------------------
function HeroObject({
  state,
  phase,
  onIntroEnd,
}: {
  state: HeroState;
  phase: Phase;
  onIntroEnd: () => void;
}) {
  const { scene, animations } = useGLTF(GLB_URL);
  const root = useRef<THREE.Group>(null);
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const actions = useMemo(() => {
    const m: Record<string, THREE.AnimationAction> = {};
    animations.forEach((c) => (m[c.name] = mixer.clipAction(c)));
    return m;
  }, [animations, mixer]);

  // Spin speed + cyan emissive intensity per state. Applied continuously (lerped),
  // so IDLE<->LOADING transitions stay smooth. Emissive stays restrained so the
  // ring reads as luminous metal, never a blown-out blob — the bloom adds the halo.
  const target = useRef({ speed: 0.35, emissive: 1.5 });
  useEffect(() => {
    if (state === 'LOADING') target.current = { speed: 1.6, emissive: 2.3 };
    else if (state === 'HOVER') target.current = { speed: 0.35, emissive: 1.9 };
    else target.current = { speed: 0.35, emissive: 1.5 };

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
  const introT = useRef(0);
  const introDone = useRef(phase === 'LIVE');

  useFrame((_, dt) => {
    mixer.update(dt);
    if (!root.current) return;

    // ---- ONE-TIME INTRO: assemble in + metallic sweep + spin settle ----
    if (phase === 'INTRO' && !introDone.current) {
      introT.current += dt;
      const p = Math.min(1, introT.current / INTRO_DURATION);
      const e = smoother(p);

      // Assemble: scale & lift from a tucked, slightly-back pose into place.
      const s = 2.4 * (0.6 + 0.4 * e);
      root.current.scale.setScalar(s);
      root.current.position.set(0, 0.2, -1.4 * (1 - e));

      // Spin: fast wind-up that eases down toward the idle rate by the end.
      const introSpin = THREE.MathUtils.lerp(2.6, 0.35, e);
      root.current.rotation.y += introSpin * dt;

      // Metallic sweep: a bright emissive pulse that crests mid-intro then relaxes.
      const sweep = Math.sin(Math.min(1, p / 0.85) * Math.PI); // 0→1→0
      const introEmissive = 1.4 + sweep * 1.9;
      applyCyanEmissive(scene, introEmissive, 1); // snap during intro

      if (p >= 1) {
        introDone.current = true;
        root.current.scale.setScalar(2.4);
        root.current.position.set(0, 0.2, 0);
        onIntroEnd();
      }
      return;
    }

    // ---- LIVE: slow elegant rotation + hover micro-tilt ----
    spin.current += (target.current.speed - spin.current) * Math.min(1, dt * 3);
    root.current.rotation.y += spin.current * dt;
    const wantTilt = state === 'HOVER' ? -0.12 : 0;
    tilt.current += (wantTilt - tilt.current) * Math.min(1, dt * 6);
    root.current.rotation.x = tilt.current;

    applyCyanEmissive(scene, target.current.emissive, Math.min(1, dt * 4));
  });

  return <primitive ref={root} object={scene} scale={2.4} position={[0, 0.2, 0]} />;
}

/** Drive the Alliance link's cyan emissive toward `value` (lerp factor `k`, 1 = snap). */
function applyCyanEmissive(scene: THREE.Object3D, value: number, k: number) {
  scene.traverse((o: THREE.Object3D) => {
    const mesh = o as THREE.Mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
    if (mesh.isMesh && mat && mat.emissive && mat.emissiveIntensity !== undefined) {
      const isCyan = mat.name?.includes('Cyan') || mat.emissive.g > 0.4;
      if (isCyan) mat.emissiveIntensity += (value - mat.emissiveIntensity) * k;
    }
  });
}

function Scene({ state, phase }: { state: HeroState; phase: Phase }) {
  const [sparksDone, setSparksDone] = useState(phase === 'LIVE');
  const [introEnded, setIntroEnded] = useState(phase === 'LIVE');

  // Sweep light: a rim light that arcs across the mark during the intro only,
  // selling the "metallic reflection sweep". Parked off-stage once live.
  const sweepLight = useRef<THREE.PointLight>(null);
  const sweepT = useRef(0);
  useFrame((_, dt) => {
    if (!sweepLight.current) return;
    if (phase === 'INTRO' && !introEnded) {
      sweepT.current += dt;
      const p = Math.min(1, sweepT.current / INTRO_DURATION);
      const a = (-0.6 + p * 1.5) * Math.PI; // swing across the front
      sweepLight.current.position.set(Math.cos(a) * 3.4, 1.6, Math.sin(a) * 2.2 + 1.5);
      sweepLight.current.intensity = Math.sin(Math.min(1, p / 0.9) * Math.PI) * 5;
    } else {
      sweepLight.current.intensity = 0;
    }
  });

  return (
    <>
      {/* Lighting sculpts the graphite Partner link without flooding the frame —
          no ground plane / contact shadows, so nothing paints a visible rectangle. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 3]} intensity={1.8} />
      <directionalLight position={[-3, 1, 2]} intensity={0.45} color="#9FD8E8" />
      <pointLight position={[-2, 2.4, -3]} intensity={3} color="#22E3D6" distance={9} decay={2} />
      {/* one-time metallic sweep light */}
      <pointLight ref={sweepLight} color="#CFFFF8" intensity={0} distance={11} decay={2} />

      <Suspense fallback={null}>
        <HeroObject state={state} phase={phase} onIntroEnd={() => setIntroEnded(true)} />
        {/* Sparks: shown ONLY during the intro, then unmounted entirely. */}
        {phase === 'INTRO' && !sparksDone && (
          <EnergySparks play onDone={() => setSparksDone(true)} />
        )}
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
  /**
   * Watermark mode — when the mark is used as a subtle background identity
   * element rather than a focal centerpiece. Skips the one-time intro burst
   * and all hover interaction; just the calm idle rotation. The parent layer
   * supplies the low opacity / blur / masking.
   */
  watermark?: boolean;
}

export function PartianceHero({
  loading = false,
  height = '100%',
  className,
  watermark = false,
}: PartianceHeroProps) {
  const [ok, setOk] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Intro plays once per session and never for reduced-motion / watermark uses.
  const [phase, setPhase] = useState<Phase>('LIVE');

  useEffect(() => {
    setOk(webglOK());
    if (watermark) return; // background watermark never plays the intro
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let played = true;
    try {
      played = sessionStorage.getItem(INTRO_FLAG) === '1';
    } catch {
      /* sessionStorage unavailable — treat as already played */
    }
    if (!reduce && !played) {
      setPhase('INTRO');
      try {
        sessionStorage.setItem(INTRO_FLAG, '1');
      } catch {
        /* ignore */
      }
    }
  }, [watermark]);

  const state: HeroState = loading ? 'LOADING' : hovered && !watermark ? 'HOVER' : 'IDLE';

  if (!ok) {
    // SVG fallback — same identity, no WebGL. The watermark layer dims it itself.
    return (
      <div className={className} style={{ width: '100%', height, display: 'grid', placeItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Partiance-fallback.svg"
          alt={watermark ? '' : 'Partiance'}
          aria-hidden={watermark || undefined}
          style={{ width: 320, maxWidth: '70%' }}
        />
      </div>
    );
  }

  // Feather the canvas region into the page on every edge. The canvas is
  // transparent (alpha), but the *lit* object still has a soft footprint; this
  // elliptical mask dissolves that footprint toward the edges so there is no
  // rectangular boundary — while keeping a wide, fully-opaque core so the logo
  // and wordmark are never clipped. Taller than wide to match the lockup.
  // Watermark mode skips this (the parent layer supplies its own mask + opacity).
  const featherMask = watermark
    ? undefined
    : 'radial-gradient(78% 92% at 50% 46%, #000 70%, rgba(0,0,0,0.55) 84%, transparent 100%)';

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height,
        WebkitMaskImage: featherMask,
        maskImage: featherMask,
      }}
      onMouseEnter={watermark ? undefined : () => setHovered(true)}
      onMouseLeave={watermark ? undefined : () => setHovered(false)}
      onFocus={watermark ? undefined : () => setHovered(true)}
      onBlur={watermark ? undefined : () => setHovered(false)}
      aria-hidden={watermark || undefined}
      aria-label={watermark ? undefined : 'Partiance'}
      role={watermark ? undefined : 'img'}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 4.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 0.92;
        }}
      >
        <Scene state={state} phase={phase} />
      </Canvas>
    </div>
  );
}

export default PartianceHero;

useGLTF.preload(GLB_URL);
