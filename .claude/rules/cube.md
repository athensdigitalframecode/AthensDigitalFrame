---
paths:
  - "source/editorial/cube.js"
  - "source/editorial/cube-gl.js"
  - "source/editorial/site.css"
---
# Hero cube (cube.js, cube-gl.js, cube section of site.css)
- `cube.js`: state and interaction. Orientation is a quaternion (drag, inertia, snap, slerp). Modes: rest, tour (auto 01→06 every 3 s, after a 5 s logo hold), pinned, drag, coast.
- `cube-gl.js`: raw WebGL, no library. Face art is painted from the DOM faces into one 4x2 atlas (text/language have one source). Shader: key light upper right, bevel edges, living logo, fold intro (per-face transforms, tesseract cage, lock rings, rim sweep), cursor gloss.
- CSS 3D cube is the fallback (`?nogl`, no WebGL, context lost) and must stay functionally identical. `?selftest` runs the geometry check.
- Every change must keep: service list as the accessible control, hover/focus pause, Esc/reset, reduced motion (no intro/tour/tweens), off-screen and background-tab pause, phones wait for the cube to scroll into view.
- Docked nav cube: `navcube()` in build.py + end of cube.js (>=1280 px, mouse only).
- Only transform/opacity animations; no layout animation. WebGL redraws only while something moves.
- Test inside the real hero at real size (cube is ~180-320 px). `?fold=slow` plays the intro at quarter speed; a frozen-clock iframe (patch performance.now to a value you set) steps it frame by frame. Hard reload after changes.
