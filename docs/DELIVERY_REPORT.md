# Athens Digital Frame — delivery report (master brief §18)

Date: 2026-11-12. Branch `redesign`; live site https://athensdigitalframe.vercel.app/ (`main`).
Completed, tested and open items are kept apart below, as the brief asks.

## 1. What was redesigned
- **Hero:** new line "Websites, thoughtfully constructed." / "Ιστοσελίδες, προσεκτικά χτισμένες.", and the interactive 3D cube replaces the device mock-ups. Entrance animation on load.
- **Home page order** follows the client journey (§8.1): Studio → Services (six capabilities) → Projects → Process → Pricing → About → FAQ → Contact.
- **Services:** six capabilities as an index, linked to the cube (each row turns the cube to its face).
- **Selected Work:** one large framed preview per project, opening its case study.
- **Process:** the gold line fills and the steps light up with scroll position.
- **Pricing:** one comparison of the three packages, same rows aligned across columns, used on the home page and on `/prices.html`. Prices appear in one place only; every figure and note unchanged.
- **About:** "Why us" and "About" merged; FAQ has group filters; Contact closes inside a gold frame with the df mark.
- **Case studies:** `work/olivane.html`, `work/arclines.html` (Greek and English) from one template that can take real client projects later.
- **Privacy policy:** `privacy.html` describing what the site actually does.
- **Design system:** rectilinear 2 px controls, plain-text navigation, flat graphite cards, solid gold primary button, glass only in the header (`source/DESIGN.md`).

## 2. References that influenced the direction
Lusion, Exo Ape, Obys, Locomotive, Immersive Garden, Dogstudio, Unseen Studio, basement.studio. Analysis and confirmed award status: `docs/RESEARCH_AND_CREATIVE_DIRECTION.md`. Strongest borrowed principles (not layouts): one brand object with a synchronised index (Obys), depth from light on one material (Immersive Garden), scale contrast in type (Exo Ape), an object that stays on stage while content changes (Dogstudio). Anti-references: long preloaders, entry gates, logo walls of clients.

## 3. The cube
- Six real faces, one per service (Discover, Design, Develop, E-commerce, Visibility, Support; Greek titles on the Greek site). Orientation kept as a quaternion, so drag, inertia, snapping and multi-axis turns are exact (`source/editorial/cube.js`).
- **Renderer:** raw WebGL, no library (`cube-gl.js`, ~10 KB): key light, bevelled gold edges, reflected softbox. It starts when the browser is idle and appears once its faces are painted; until then, and whenever WebGL is missing or lost, the CSS 3D cube is shown. Face artwork is painted from the HTML faces, so text and language have one source.
- **Intro (scanner):** a thin gold line sweeps down the stage and the cube is built behind it, first as gold wireframe, then solid; at the lock a light pool fades in under the cube and the headline rises line by line. Plays once; waits while the tab is hidden; on phones it waits until the cube is on screen; reduced motion shows the cube assembled. Without WebGL the line sweeps and the CSS faces fade in behind it.
- **Cursor:** with a mouse over the cube it leans a few degrees and a soft gloss follows the pointer across the faces (WebGL).
- **Docked navigation cube:** on wide screens with a mouse, after the hero, a small cube bottom-right turns to the section being read (Services, Olivane, Arclines, Process, Pricing, Contact); a click on a face goes there, and the concept faces expand into the demo.
- **States:** after the intro the logo holds for 5 s (counted from page open), then the cube turns to the next service every 3 s (01 → 06, then 01 again), and the description under it changes with each face. Hover or keyboard focus pauses it on the face in front and leaving resumes; so does a mouse resting on the cube. Drag with inertia or a click pins a face (it resumes when the pointer leaves); a service chosen from the list stays until "Back to the logo" or Esc. It also pauses off screen and in background tabs. Automatic changes are not announced to screen readers; the user's own choices are. The floor shadow follows the cube's on-screen width.
- **Accessibility:** the 3D object is hidden from assistive tech; the six buttons and the live description are the real content. Without JavaScript the six descriptions are listed. Reduced motion: no tour, no tweens.

## 4. Logo
The owner's original `df` mark (1024 px JPEG, unmodified) is shown on a black plate on the front face; the plate recedes when a service is shown and returns at rest. Six faces, no seventh. The same mark closes the contact section.

**Living logo.** In WebGL a warm reflection crosses the mark about every 5 s on an uneven rhythm, a faint gold halo breathes around it, and its brightness drifts slightly on two slow, unrelated cycles. All light is masked by the logo's own brightness, so its shape and colours stay exactly the original's. The light is redrawn at about 30 fps only while the logo is visible and on screen; under reduced motion it is static. Without WebGL the CSS cube shows the same sweep through a luminance mask.

## 5. Service interactions
Hover tour, drag (mouse and horizontal touch), tap/click to step, service buttons under the cube, "Show it on the cube" from the Services section (scrolls up and pins the face), reset button and Esc.

## 6. Other interactions
Page-load entrance (header fades in, the hero copy rises in order, the cube settles in last), magnetic primary button (fine pointers only), scroll-linked process, section headings rising word by word, FAQ group filter, framed image hover, language switch that keeps the page.

**Navigation hover:** the six header links lift 1 px, scale to 1.02, take a soft gold wash and draw a gold hairline from the centre. It uses transform only, so the header never reflows; it applies to mouse pointers only (touch gets the plain tap state), keyboard focus gets the same look, and it is off under reduced motion.

**Brand name typography:** Sora SemiBold was tried in the header and footer lockup on 2026-11-12 and **reverted at the owner's request**; the name is Marcellus 400, 15 px, letter-spacing .18em, as before. The Sora files were removed from the project.

## 7. Dependencies added
None. No package.json, no libraries; the build is the existing Python script. Lighthouse was run once via `npx` from a scratch folder and is not part of the project.

## 8. SEO and performance
- Sitemap generated by `build.py` (10 URLs with hreflang), six services in structured data (OfferCatalog), FAQPage data for all 16 questions, new social preview images (JPEG, ~65 KB).
- Strict CSP (`script-src 'self'`), long cache for hashed assets, the WebGL cube deferred to idle, layout class set before first paint, metric-matched fallback fonts.
- Lighthouse on localhost (Chrome, 2026-11-12, measured before the auto-rotation and living-logo passes; mobile performance on the home page then dropped to ~69 because the cube now keeps moving, desktop stayed at 99): SEO 100; accessibility 93–97; desktop performance 93–100, CLS 0; mobile performance 73–86 on the home page. Local runs are pessimistic: no compression or HTTP/2 on the local server, and antivirus software injected a script into every page. Remaining accessibility flag: header contrast measured against a blurred background, which the tool cannot compute (visual check passes).

## 9. Tests completed
- Desktop Chrome: every page in both languages; cube self-test (geometry), hover tour, drag with inertia, selection, reset, Greek re-render, no-WebGL fallback (`?nogl`), reduced-motion and no-JS modes; form validation and the no-JS submit (no personal data in the URL); FAQ filter; scroll-spy; all internal links resolve; no console errors.
- Widths 390, 700, 820, 1440, 1536 px: no horizontal scroll; tap targets 44 px.
- Pixel comparison of 10 screenshots before/after the CSS clean-up (identical).
- Live and preview deployments on Vercel: CSP active with no blocked scripts, pages and assets 200, `source/` and `docs/` not served.

## 10. Not done / not verified
- **Real devices:** iPhone/Android, desktop Safari and Firefox were not tested by me.
- **Greek copy** (services, case studies, privacy) has not been proofread by a native speaker.
- **Owner wording to confirm:** the two "intent" sentences in the case studies; the privacy promise not to sell or share messages.
- **Terms of use** page does not exist (needs the owner's rules).
- **Contact form** has no server: no server-side validation, spam protection or budget field (§9, §20.1). Decision pending.
- **Cube on touch:** horizontal drag only; no separate pause control (pinning acts as pause).
- 16 CSS selectors are still written in more than one place (e.g. `.hero`, `.hd`, `.nav a`, `.sheet`). They are deliberate: a later rule overrides an earlier one at certain widths, so merging them would change the cascade. 13 dead declarations were removed and 56 moved into one rule; the old and new stylesheets give identical computed styles for every element, including `::before`/`::after`, on five pages at eight viewport sizes (the cube canvas and the hero's slow breathing light are excluded because they animate).
- Auto-rotation, the living logo and the menu hover were tested on desktop Chrome only (timing, pause and resume paths, reduced motion, CSS-cube fallback); touch behaviour is untested on real phones.
