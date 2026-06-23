// =============================================================================
//  <LogoBackdrop /> — the premium 3D brand sculpture behind the page.
//  A SINGLE WebGL canvas (perf-friendly) renders three instances of the real
//  Partiance mark (center + left + right) as floating metal sculptures:
//  beveled 3D geometry from the GLB, a polished metallic teal-cyan material,
//  image-based reflections, soft contact shadows (floating feel) and a gentle
//  volumetric bloom. Heavily dimmed + radially masked by the parent so it reads
//  as luxury background depth — never competing with the content.
//
//  Falls back to nothing (the SVG watermark is kept as a no-WebGL fallback by
//  the caller) and is skipped for reduced-motion users.
// =============================================================================
'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const GLB_URL = '/Partiance.glb';

type Instance = {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  /** float amplitude + speed + phase for a slow, physical drift */
  floatY: number;
  speed: number;
  phase: number;
  spin: number;
};

// Three sculptures: a dominant centre, a smaller left, a smaller right — pushed
// back in Z so they sit clearly "behind" the content plane.
const INSTANCES: Instance[] = [
  { position: [0, 0.1, -1.5], scale: 2.6, rotation: [0.1, -0.5, 0.04], floatY: 0.16, speed: 0.18, phase: 0, spin: 0.04 },
  { position: [-4.4, 1.3, -3.2], scale: 1.5, rotation: [0.18, 0.6, -0.12], floatY: 0.22, speed: 0.14, phase: 2.1, spin: -0.03 },
  { position: [4.6, -1.4, -3.6], scale: 1.6, rotation: [-0.12, -0.7, 0.14], floatY: 0.2, speed: 0.12, phase: 4.2, spin: 0.05 },
];

/** A single floating, slowly-rotating logo sculpture with premium metal material. */
function Sculpture({ inst }: { inst: Instance }) {
  const { scene } = useGLTF(GLB_URL);
  const group = useRef<THREE.Group>(null);

  // Clone so each instance is independent, and re-skin every mesh with a
  // polished metallic teal-cyan material (strong reflections, crisp highlights).
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshStandardMaterial | undefined;
      // Detect the luminous "Alliance" link (cyan emissive) vs the graphite body.
      const isCyan = src?.name?.includes('Cyan') || (src?.emissive && src.emissive.g > 0.4);
      mesh.material = new THREE.MeshStandardMaterial({
        color: isCyan ? new THREE.Color('#1FB9AE') : new THREE.Color('#0C2A2E'),
        metalness: 1,
        roughness: isCyan ? 0.18 : 0.32,
        emissive: isCyan ? new THREE.Color('#16C8BC') : new THREE.Color('#06201F'),
        emissiveIntensity: isCyan ? 0.55 : 0.12,
        envMapIntensity: 1.6,
      });
      mesh.castShadow = true;
      mesh.receiveShadow = false;
    });
    return c;
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // slow vertical float + a very slow yaw drift → "physically floating"
    group.current.position.y = inst.position[1] + Math.sin(t * inst.speed + inst.phase) * inst.floatY;
    group.current.rotation.y = inst.rotation[1] + Math.sin(t * inst.speed * 0.6 + inst.phase) * 0.12 + t * inst.spin;
    group.current.rotation.x = inst.rotation[0] + Math.sin(t * inst.speed * 0.5 + inst.phase) * 0.05;
  });

  return (
    <group
      ref={group}
      position={inst.position}
      rotation={inst.rotation}
      scale={inst.scale}
    >
      <primitive object={cloned} />
    </group>
  );
}

function BackdropScene() {
  return (
    <>
      {/* Sculpting light rig: a cool key + warm-neutral fill + cyan rim, tuned so
          the bevels and thickness catch crisp highlights without flattening. */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#EAFBFF" castShadow />
      <directionalLight position={[-5, 1, 2]} intensity={0.5} color="#7FE8DA" />
      <pointLight position={[0, -2, 2]} intensity={2.2} color="#16C8BC" distance={16} decay={2} />
      <pointLight position={[-6, 3, -2]} intensity={1.6} color="#5BD8FF" distance={18} decay={2} />

      <Suspense fallback={null}>
        {INSTANCES.map((inst, i) => (
          <Sculpture key={i} inst={inst} />
        ))}
        {/* Soft ambient contact shadow under the centre sculpture → it reads as
            floating above a surface, adding depth without a hard ground plane. */}
        <ContactShadows
          position={[0, -2.6, -1.5]}
          opacity={0.45}
          scale={14}
          blur={3.2}
          far={6}
          resolution={512}
          color="#021014"
        />
        {/* Image-based lighting drives the metallic reflections. Never shown as bg. */}
        <Environment preset="night" environmentIntensity={0.7} />
      </Suspense>

      {/* Volumetric glow — a restrained bloom so the cyan links and metal
          highlights bloom softly, selling "luxury sculpture" without haze. */}
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur radius={0.55} />
      </EffectComposer>
    </>
  );
}

export function LogoBackdrop({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 38 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.0;
        }}
        frameloop="always"
      >
        <BackdropScene />
      </Canvas>
    </div>
  );
}

export default LogoBackdrop;

useGLTF.preload(GLB_URL);
