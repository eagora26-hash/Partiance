# Partiance — Brand System (`/branding/partiance`)

*Partner + Alliance.* The canonical brand assets for the Partiance landing hero.

```
branding/partiance/
  Partiance.glb              animated 3D hero (symbol + real 3D wordmark + idle/loading/hover clips)
  Partiance.blend            Blender source scene
  Partiance-fallback.svg     2D fallback (same identity, no WebGL)
  PartianceLogo.tsx          2D symbol — interlocked links (Partner graphite + Alliance cyan)
  PartianceWordmark.tsx      2D "Partiance" wordmark (the GLB has the real 3D mesh)
```

## How it's wired into the app
- The hero is REAL 3D: `Partiance.glb` is copied to `public/Partiance.glb` and rendered
  by `src/components/hero/PartianceHero.tsx` (React Three Fiber).
  - **IDLE** → slow continuous rotation
  - **LOADING** → faster rotation + stronger cyan emission
  - **HOVER** → micro-tilt + glow increase
- The 2D companions (`PartianceLogo`, `PartianceWordmark`) are mirrored into
  `src/components/brand/` and used in nav / footer / auth where flat marks belong.
- WebGL-unavailable users get `public/Partiance-fallback.svg`.

The larger build pipeline (`build.py`, hero renders, Web prototype) lives in
`Partiance_Brand/`. This folder is the trimmed, app-facing canonical set.
