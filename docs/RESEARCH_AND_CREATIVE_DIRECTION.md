# Research and creative direction (brief stage 2)

Prepared 2026-11-11. Status: **proposal, not approved**. Nothing here is implemented.

## How the research was done (and its limits)
Eight live studio sites were opened in desktop Chrome (viewport about 1536x650) on 2026-11-11. For each: the loaded hero, one scroll step, and where available the page text. This is a first pass, not a deep teardown:
- Not tested: mobile layouts, case-study subpages, menus, keyboard access, source code, performance numbers.
- Award status was not re-verified on Awwwards/FWA/CSSDA for each site; they are studios widely listed there, and a search confirmed only Unseen Studio (Awwwards Site of the Day, 24 Mar 2026). Treat "award-winning" as reported, not verified, until checked.
- No cookie banners were accepted and no forms were touched.

## References

### 1. Lusion — https://lusion.co
- **Identity:** pale lavender-white page, black type, one saturated blue; a dark rounded "stage" holds the 3D.
- **Hero:** a cluster of glossy black/white/blue 3D connectors that reacts to the pointer; one sentence of positioning above it. Small "+" registration marks pin the stage to the grid.
- **Type/composition:** plain grotesque, small sizes; the 3D carries the drama, the type stays quiet.
- **Interaction:** physical, glossy materials with believable reflections.
- **Services/work:** work list with discipline tags (Concept, Web, Design, Development, 3D).
- **Observed cost:** a numeric preloader ran for well over 10 seconds before any content appeared.
- **For ADF:** a 3D object reads as premium when it has material and a clear stage. The preloader is the anti-lesson: ADF sells fast sites to local businesses, so content must be readable before the cube is ready.

### 2. Exo Ape — https://www.exoape.com
- **Identity:** full-bleed architectural photography, white type, almost no UI.
- **Hero:** one sentence, then on scroll the words "Digital / Design / Experience" at enormous size over the image.
- **Type/composition:** scale contrast is the whole design: tiny nav, huge headline, generous empty space.
- **Interaction:** slow, calm scroll transitions; header collapses to mark + "Menu".
- **Services/work:** "Featured Projects" with one line of framing copy; no card grids.
- **For ADF:** confidence comes from scale and restraint, not effects. ADF already has an editorial serif (Noto Serif Display) that can carry this.

### 3. Obys — https://obys.agency
- **Identity:** white page, black type, strict grid; black bracket shapes frame the active project.
- **Hero:** there is no "hero": a vertical strip of project thumbnails in the centre, a project index on the left, discipline and number on the right, studio statement top-right.
- **Type/composition:** tiny text set on a visible grid; the layout itself is the brand ("Vertical, Horizontal, Grid").
- **Interaction:** scrolling moves the strip; the index, the brackets and the metadata stay in sync with the active item.
- **For ADF:** the strongest idea for the cube: **one central object, with an index list and a description that stay synchronised with it.** Also proof that a frame/bracket device can be an identity.

### 4. Locomotive — https://locomotive.ca/en
- **Identity:** black and red photographic hero, light serif display type, white content pages.
- **Hero:** portrait lit by projected red type; studio name and "Digital-first Design Agency" at the bottom.
- **Type/composition:** navigation written as a plain sentence ("Work, Agency, Careers, Store"); work items are an image, a hairline and a title with an arrow.
- **Interaction:** restrained; smooth scroll, header inverts over content.
- **For ADF:** hairline + title + arrow is enough for a work entry. Navigation can be text, not a capsule.

### 5. Immersive Garden — https://immersive-g.com
- **Identity:** monochrome pale grey; a small serif wordmark and one line: "Innovative digital experiences studio".
- **Hero:** a sculpted bas-relief emerges from the page surface, lit softly, same colour as the background.
- **Type/composition:** extreme negative space; four small text anchors in the corners.
- **Interaction:** the relief develops with scroll; a short counter preloader (noticeably faster than Lusion).
- **For ADF:** the closest match to "architectural minimalism" in the brief. **Depth from light on one material**, not from colour or glow. This is the right lighting model for the cube: graphite on graphite, gold only on edges.

### 6. Dogstudio — https://dogstudio.co
- **Identity:** dark blue-violet atmosphere, heavy serif headline, a 3D wolf as mascot.
- **Hero:** the 3D object sits in the centre; the headline overlaps it; on scroll the object stays while project titles pass in front of it.
- **Interaction:** the object persists across sections and re-lights per project.
- **For ADF:** a brand object that **stays on stage while content changes around it** is the model for hero-to-Capabilities continuity. The saturated gradients and the cookie banner over the hero are not for ADF.

### 7. Unseen Studio — https://unseen.co
- **Identity:** warm pink, cartoon eyes that follow the pointer, friendly tone.
- **Hero:** an entry gate: "Enter" or "Enter without audio".
- **For ADF:** a tiny reactive detail gives personality at almost no cost. The entry gate is an **anti-reference**: the brief forbids forcing visitors through extra steps, and sound.

### 8. basement.studio — https://basement.studio
- **Identity:** black, technical, a navigable 3D studio room as hero; "Human / Machine" mode switch.
- **Services/work:** a large wall of client logos directly under the hero.
- **For ADF:** the Human/Machine switch shows respect for people who do not want the 3D. The logo wall is an **anti-reference**: ADF has no published clients and must not imply any.

## What the best of them share
1. One idea per screen; everything else is quiet.
2. A single brand object or device, repeated with discipline (Obys brackets, Dogstudio wolf, Immersive Garden relief).
3. Type does the work: either very large or very small, rarely medium.
4. The grid is visible (marks, hairlines, indices) and the layout snaps to it.
5. Where 3D is heavy, the cost is paid in loading time. Only some pay it well.

## Proposed direction for Athens Digital Frame: "THE FRAME, constructed"
The brief's concept is *THE FRAME — Digital experiences, thoughtfully constructed.* ADF already owns the device: gold outline, crop marks, hairline rulers with registration ticks. The proposal is to stop using it as decoration around previews and make it the construction logic of the whole site, with the cube as its three-dimensional form.

### The cube
- **A frame in three dimensions.** Six graphite faces; edges are fine gold hairlines; each face carries crop marks in its corners. It reads as the logo's world made solid, not as a generic cube.
- **Material.** One material (dark graphite, slightly satin), lit by one warm key light from above-right (the light the site already uses). Shading changes per face as it turns. No glow, no particles.
- **Logo.** The official `df` mark is inlaid on the front face as a raised plate (the "passe-partout"). On interaction the plate recedes and the face beneath shows DISCOVER. It returns when the cube returns to rest. Six faces, no seventh.
- **Faces.** Each face: index number, service title in the display serif, and one small line drawing built only from frame parts (rules, ticks, corners) so the six are different but related.
- **Sync.** Beside the cube: an index of the six services and one description that changes with the active face (the Obys principle). The same index drives the Capabilities section further down.
- **Stage.** The cube stands on the existing gold floor line; the hero column rules align to its edges.

### Layout and type
- Hero: headline at real editorial scale, cube as the anchor, index and description as the third element. Content is readable before the cube initialises.
- Sections open with the existing ruler; section numbers and labels sit on the grid.
- Work: two large framed previews, hairline, title, arrow, "concept project" label.
- Capabilities: a six-row index, not cards.

### What changes from the current approved design (needs owner decision)
The brief's "avoid" list touches three things approved on 2026-11-09:
1. **Pill buttons and capsule nav** -> rectilinear controls with 2px radius and frame corners; nav as plain text links. (Brief: avoid excessive rounded shapes.)
2. **Glass panels** -> keep at most the header blur; forms and cards become flat graphite with hairlines. (Brief: avoid overused glassmorphism.)
3. **Gold gradient on the primary button** -> flat gold. (Brief: avoid excessive gradients.)
Kept: graphite surfaces, gold `#C9A96E` family, grain, key light, rulers, fonts, logo, all copy and prices.

## Cube technology: recommendation
Constraints verified in the repo: static site, no bundler, no dependencies, CSP `default-src 'self'`, Greek and English text on the faces.

| | CSS 3D transforms | WebGL (self-hosted three.js) |
|---|---|---|
| Face text | real HTML, bilingual via `t(el,en)`, selectable, readable by assistive tech | texture or overlay; needs a hidden HTML copy |
| Lighting | per-face shading computed from rotation; no true reflections or cast shadows | real lights, materials, reflections |
| Weight | a few KB of JS, no dependency | roughly 150 KB+ gzip, plus fallback path |
| Fallback | degrades to the same HTML laid flat | separate non-WebGL view required |
| CSP | no change | no change if self-hosted |

**Recommendation:** build the stage-3 prototype in CSS 3D with rotation handled in JS as a quaternion (so drag, inertia, snapping and X/Y/Z sequences are correct), and judge it against brief 4.7. Move to WebGL only if the material quality is not good enough in the prototype. The reduced-motion and no-3D fallback is the same index + description without rotation.

## Open questions for the owner
1. Approve or adjust the direction above, especially the three changes to the current design.
2. Greek names and descriptions for the six services (a translation will be drafted for approval).
3. Is a higher-resolution original of the logo available? The repo has only a 145x121 PNG, which limits how large the logo plate can be on the cube.

## Decisions and status (2026-11-11, later the same day)
- **Owner decision:** on the Greek site the cube faces carry Greek titles (Ανακάλυψη, Σχεδιασμός, Ανάπτυξη, E-commerce, Προβολή, Υποστήριξη). The Greek descriptions are a draft translation, not yet proofread by a native speaker.
- **Logo:** the owner supplied a 1024x1024 JPEG on black: `source/brand/df-logo-original.jpg`. The cube shows it unmodified as a black plate (the mark is always on black, per DESIGN.md).
- **Cube prototype (brief stage 3):** `source/cube/` (`index.html`, `cube.css`, `cube.js`), CSS 3D, no dependencies, not published. Run `python -m http.server 8765` in the repo root and open `/source/cube/` (`?selftest` checks that every face target comes forward upright).
  - Checked in desktop Chrome: geometry self-test; hover tour (order Discover, Design, Visibility, Develop, Support, E-commerce) and return to the logo; picking from the list; drag with inertia and snap; reset; Greek text; no horizontal overflow at 390 and 768 px.
  - Not checked yet: real touch devices, Safari/Firefox, reduced-motion mode, the no-JS fallback, performance on a slow phone.
  - Known limits: touch drag is horizontal only (vertical swipes scroll the page; top and bottom faces are reached by tap or the list). No true reflections (CSS 3D). Pinning a service is the pause control; there is no separate pause button.
- **Still open:** the three changes to the approved design (pills, glass, gradient).

## WebGL renderer (owner asked to try it, 2026-11-11)
- Added `source/cube/cube-gl.js`: raw WebGL, **no library and no new dependency** (about 10 KB unminified). It gives what CSS 3D could not: a real key light, bevelled gold edges that catch it, and a reflected studio softbox (procedural, no image).
- Interaction logic is unchanged and shared (`cube.js`). The CSS cube stays in the page as the automatic fallback (no WebGL, shader failure, context loss) and as the single source of the face artwork: the WebGL faces are painted from the DOM faces, so text and language cannot drift apart. `?nogl` forces the CSS cube for comparison.
- Checked in desktop Chrome: self-test, WebGL active, logo plate and its fade, list selection, hover tour and return, drag with inertia and snap, Greek re-render, 390 px width, `?nogl` fallback, no console errors.
- One of three automated hover runs showed services out of order and could not be reproduced (the automation's own mouse was probably over the cube). Needs a check with a real mouse.
- Not checked: touch devices, Safari/Firefox, reduced-motion, low-end phones, context loss in practice.
- Limits: reflections are of a procedural studio, not of the page; the floor shadow is still CSS and does not follow the rotation.
