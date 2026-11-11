# Athens Digital Frame: DESIGN.md (editorial system, 2026-11)

Warm, editorial, restrained, in the original black / cream / gold brand. (Earlier dark-only rules: `legacy/DESIGN-dark-gold.md`.)
Every visual decision needs a purpose. No generic SaaS look: no gradient hero, no glass, no icon cards, no floating decoration.

## Brand sources (checked, not approximated)
- Logo: the white "df" ligature with a small gold corner, on black (`favicon-192.png` / `apple-touch-icon.png`, and the 120x100 PNG embedded in the old home page). The original WhatsApp JPEG is not in the repo, so `assets/df-mark.png` (145x121, transparent) was extracted from the 192px icon with its own colours (white `#F4F4F6`, gold wedge). It is always shown on black: header, footer and mobile menu are black, so only this one variation is needed. Never redraw or recolour it.
- Colours from the original DESIGN.md and the logo: black `#0B0B0B`, cream `#F5F1E8`, gold `#C9A96E` (light `#D9BE86`, soft `#E6CF9F`). Wordmark font Marcellus.
- The gold Parthenon arch (`legacy/frame.svg.txt`) is inlined statically behind the hero devices.

## Tokens (all in `editorial/site.css` :root)
- Brand: `--black`, `--cream`, `--gold`, `--gold-lt`, `--gold-soft`. Derived: `--gold-deep #7A5F22` (gold for small text on cream, 5.3:1 on cream, 4.8:1 on paper), `--paper #ECE4D3`, `--muted #5C584D`, hairlines `--line` and `--line-gold`. Error `#9B2D20`. Do not add colours.
- Rhythm: black header, black hero, cream sections, `--paper` bands, black process and contact, black footer.
- Gold is selective: primary CTA (gradient button, black text), eyebrow rules and small labels, numerals, crop marks, price notes, hover states. Headings stay black or cream; only the one italic emphasis word goes gold (`--gold-lt` on black, `--gold-deep` on cream).
- Type: headlines Noto Serif Display 500 (italic 400 for emphasis), body Manrope 400-700, wordmark Marcellus. All self-hosted in `/fonts`. Scale `--fs-0..4` (clamp).
- Spacing 4/8/12/16/24/32/48/72/112, container 1200px + `--pad`, radius 2px, hairline borders.
- Breakpoints: 560, 760, 900, 1000, 1040 (desktop nav).

## Frame motif
`.fr` = offset gold outline + four gold crop-mark corners around images and device mockups. Use it for project previews, not for text cards.

## Components
Buttons `.btn` (black, gold on hover), `.gold` (primary CTA, the only gold-filled button), `.ghost`; on `.dark` the default turns cream. Tags `.tag2` (`req` filled = mandatory, `opt` dashed = optional). Rows `.row` for prices. Details/summary FAQ. Tabs with arrow-key support for the process.

## Motion
Fade/lift on reveal (`.rv`), image clip reveal, process line draws once. Everything off under `prefers-reduced-motion`. No parallax, no scroll hijack.

## Content rules
- Prices (do not change without the owner): website 300 EUR (up to 3 pages), hosting+domain 50 EUR/year (required), maintenance 20 EUR/month (optional), e-shop setup 200-300 EUR, subscription 30-50 EUR/month with 12-month minimum, first-year e-shop 560-900 EUR, Skroutz 150, BOX NOW 120, referral 50 EUR or 2 months free (friend 10% off). No VAT.
- Never invent clients, reviews, results, founders or history. Olivane and Arclines are labelled self-initiated fictional concepts.
- The contact form has no backend: it hands a prepared message to WhatsApp or the mail app and says so.
- Legal pages do not exist yet: footer shows clearly marked "coming soon" placeholders, not links.
- Every page exists in Greek (root) and English (`/en/`), both generated; keep copy in sync via `t(el, en)`.

## Atmosphere layer (added after the arc was removed)
The gold arc behind the hero was removed: it was decoration with no information. Depth now comes from light and material, all in `site.css` under "atmosphere":
- **One key light.** Dark surfaces get a warm gold light from above-right (`.dark::before`); the hero light sits behind the mockups, breathes (16s opacity), and drifts a few px with the pointer (desktop, motion allowed, transform only).
- **Grain.** A fine SVG noise (data URI, `--grain-l` on dark, `--grain-d` on light, 3.5-6% opacity) removes the flat digital fill.
- **Structure, not ornament.** Four hairline column rules in the hero follow the layout grid and fade out downward; hidden under 700px.
- **Grounded objects.** The hero mockups stand on a thin gold floor line with a soft pool of light.
- **Seams.** Hero ends with a gold hairline and inner shade; cream/paper sections get a faint top light instead of a flat fill.
- **Small details.** Gold text selection, glass header after scroll with a gold reading-progress hairline, one light sweep on the gold button hover.
All motion is compositor-only and disabled under `prefers-reduced-motion`.


## Dark studio system (supersedes the cream/black alternation)
The whole site is now dark. Cream is text only, never a surface.
- **Surfaces:** layered graphite tokens `--s0` (deepest: hero, process, contact, footer) to `--s4`. Sections alternate `--s1`/`--s2`; each gets a faint top edge light, one warm gold radial and one cool graphite radial (alternating left/right), and fine grain. No flat fills.
- **Geometry:** every section opens with a hairline ruler with five registration ticks (the frame motif, rectilinear, no arcs); the hero keeps four column rules. Frame outlines and crop marks stay on project previews, which are lit from behind.
- **Text:** body `--cream`, secondary `--muted` (cream 68%), small accents `--gold` (7:1+ on all surfaces), italic headline word `--gold-lt`. Errors `--err` (#F29A8A).
- **Controls:** rectilinear, 2px radius, like the frame (`--pill` is now 2px; the name is kept so one token still drives buttons, tabs, chips, radios, language switch). Primary `.btn.gold`: solid gold, no gradient, square arrow chip, one light sweep on hover. Default `.btn`: translucent fill with hairline border, gold on hover. `.btn.ghost`: outline. No pills, no circles.
- **Navigation:** glass bar (the only blur on the site); centred plain-text nav with scroll-spy (active link turns gold with a dot); mobile sheet with display links and a gold corner light.
- **Forms/cards:** flat graphite (`--s2`) with a hairline border and 2px radius, no glass, no drop shadow; inputs are dark wells with a gold focus ring.
- Changed 2026-11-11 on the owner's decision, following the master brief's "avoid" list (rounded cards, glassmorphism, gradients).
Tokens live in `:root`; the dark system block is at the end of `site.css`.

## Hero cube (2026-11, brief section 4)
The hero's right column is the brand cube; the device mock-ups moved out of the hero (the projects section still shows them).
- **What it is:** six faces = six services (Discover, Design, Develop, E-commerce, Visibility, Support; Greek titles on the Greek site). Data and copy live in `SERVICES` in `build.py`; `Page.cube()` emits the markup.
- **Logo:** `assets/df-logo-1024.jpg` (owner's original, unmodified) on a black plate on the front face. At rest the plate is up; on interaction it recedes and DISCOVER shows. Six faces, never a seventh.
- **Look:** graphite faces, gold bevelled edges, crop marks in every corner, one warm key light from above right (same light as the hero). No glow, no particles.
- **Behaviour (`editorial/cube.js`):** rest (logo) -> hover tour through all six with a pause on each -> back to rest; drag (mouse/touch, inertia, snaps to the nearest face) or a click on the list pins a service until "Back to the logo" or Esc. One animation at a time. Touch drag is horizontal only so the page still scrolls.
- **Rendering:** `editorial/cube-gl.js` (raw WebGL, no library) when available; otherwise the CSS 3D cube in `site.css` (`.cb-*`). The WebGL faces are painted from the DOM faces, so there is one source of text. `?nogl` forces CSS, `?selftest` checks the face targets.
- **Accessibility:** the 3D object is `aria-hidden`; the list of six buttons and the description (`aria-live`) are the real content. Without JS the cube is hidden and all six descriptions are listed. Reduced motion: no tour, no tweens.
- Sizes are tied to `--cs` (viewport-height aware) so the hero still fits the first screen.

## Page order and heading scale (2026-11, brief 8.1)
Home follows the client's journey: hero (cube) -> 01 Studio -> 02 Services -> 03 Projects -> 04 Process -> 05 Pricing -> 06 Why us -> 07 About -> 08 FAQ -> 09 Contact. The header nav uses the same order. Section backgrounds alternate `sec paper` / `sec`, with `sec dark` for Process and Contact.
`.h2` is `clamp(26px, min(2.6vw + 16px, 6.4vh), 54px)`: editorial scale on wide screens, and the vh cap keeps it below the hero `h1`, which is itself capped by viewport height.

## Case studies (2026-11, brief section 6)
`work/<key>.html` and `en/work/<key>.html`, generated by `Page.build_case()` from `CASES` in `build.py`. One template for every project: hero (concept chip, sector, name, lead, View live) -> framed preview -> 01 Brief (+ facts) -> 02 Direction (real palette and fonts from the demo, optional image strip) -> 03 Components -> 04 Phone, motion, what is sample -> 05 free-demo CTA and link to the next concept.
It reuses `.phero`, `.about`, `.facts`, `.caps`, `.pv`; only `.cs-pv`, `.sw` (swatches) and `.stages` are new.
Rules: every statement must be checkable in the demo's code; no metrics, awards, clients or testimonials; the concept chip and the "Client: none; fictional company" row stay until a real project replaces them. New pages must be added to `sitemap.xml` by hand.
