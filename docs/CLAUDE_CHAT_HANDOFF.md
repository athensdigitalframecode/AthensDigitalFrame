# CLAUDE_CHAT_HANDOFF.md — Athens Digital Frame

> **Correction 2026-11-12 (owner):** there is no partner. The owner runs the studio and this project alone; every "partner" statement from the earlier notes was wrong and has been removed. `arclines/` is the owner's and can be edited.

Status labels: **VERIFIED** = inspected in the repo/files this session; **REPORTED** = stated in project notes/memory, not re-checked; **UNKNOWN** = not established.
Prepared 2026-11-11 from: repo `athensdigitalframecode/athensdigitalframe` (HEAD `2226bab`), Project doc `PROJECT_HANDOFF.md`, Project memory, `CLAUDE.md`, `source/DESIGN.md`. No secrets are included or known.

## 0. Critical gaps (read first)
- **The original 21-section master prompt is NOT retrievable.** It is not in the repo, the Project knowledge (only `PROJECT_HANDOFF.md` exists), or memory. `ATHENS_DIGITAL_FRAME_MASTER_BRIEF.md` was therefore **not created**; nothing was reconstructed. The user must paste or attach the original prompt.
- The brief mentions **"six core services"**. The live site shows **three** (business websites, e-commerce, custom solutions). Six services: UNKNOWN.
- `claude/website-restore.md` (referenced in an earlier handoff) does not exist in the Project.
- Original logo file (WhatsApp JPEG) is not in the repo (see §5).

## 1. Overview (VERIFIED unless noted)
Athens Digital Frame (ADF): a one-person digital studio in Athens building websites and e-shops for local businesses. Instagram `@athens.digitalframe`. Site is bilingual (Greek root, English `/en/`). Offer: free demo before any payment. Partner builds websites/e-shops; user handles Instagram and client acquisition (REPORTED, memory). Creative direction now: dark premium studio (graphite surfaces, gold accents, grain, hairline rulers).
Live URL: `https://athensdigitalframe.vercel.app/`.

## 2. Implementation status
VERIFIED shipped on `main`:
- Dark studio redesign (`8c9b7ad`/`81bf8c9`), header fix (`5ed228c`), hero-fits-first-screen (`2226bab`: hero fully visible at 1920×1080, 2560×1300, 1280×720, 1366×768, 1440×900, 1536×730, 1024×700, 961×653, 768×1024; two-column from 700px; <700px stacked).
- Pages: home and prices, Greek + English. Concept demos `/olivane/` and `/arclines/`.
Incomplete / not done: legal pages (Privacy, Terms are "coming soon" placeholders), real-device test, Lighthouse, screen-reader pass, demo sites not restyled (14 small tap-target items flagged, REPORTED), "more demo concepts coming soon".
Not re-run after the last hero edit: contrast and menu/form audits (only overflow + fold fit were re-checked).

## 3. Technical architecture (VERIFIED)
- Static site, **no framework, no package.json/dependencies**. Hosting Vercel; `main` auto-deploys.
- Generator `source/editorial/build.py` (Python 3, 305 lines) writes `index.html`, `prices.html`, `en/index.html`, `en/prices.html` and copies `site.css`/`site.js` to content-hashed `assets/site.<hash>.css|js` (old hashes deleted). Copy is in `build.py` via `t(el,en)`; FAQ/process wording read from `source/legacy/faq.html` and `how.html`.
- Styling: single hand-written `site.css` (~347 lines), CSS custom properties; dark system block at end. JS: `site.js` (72 lines): menu/burger, scroll-spy, reveal, tabs, form handoff. No animation or 3D libraries on the main site.
- Fonts self-hosted in `/fonts` (Noto Serif Display, Manrope, Marcellus; OFL licences included).
- Routing: static files; `/en/` for English; hreflang el/en/x-default set; `sitemap.xml` lists 4 URLs; `robots.txt` allows all.
- `vercel.json`: strict CSP (`default-src 'self'`, `img-src 'self' data:`, no connect to third parties, `form-action 'self'`), nosniff, X-Frame-Options DENY, HSTS, COOP, Permissions-Policy. A separate header block applies to `/olivane/` and `/arclines/`.
- Backend/integrations: **none**. Contact form has no server: it opens WhatsApp or the mail app with a prepared message. No analytics, no cookies, no consent banner found (grep: 0 hits). Hence no cookie consent needed currently.
- Olivane: static page, uses `<canvas>`, AVIF/WebP images in `olivane/img/`. Arclines: `js/art.js`, `js/main.js`, `css/style.css`, canvas art, WebP assets. Neither pulls external libs (a "three" string appears in Olivane; usage not investigated, UNKNOWN).
- Branch workflow: work on `dark`, push `git push origin dark:main`. 201 commits in history; many stale remote branches (babel-*, frame-*, etc.).
- Testing tools (not in repo): Playwright + `/usr/bin/google-chrome`; local `python3 -m http.server 8765`.

## 4. Codebase map
`CLAUDE.md` (agent rules, Russian) · `source/DESIGN.md` (design system; read before UI work) · `source/README.md` · `source/editorial/{build.py,site.css,site.js}` (edit these) · `source/legacy/` (old gold generator, unused) · generated `index.html prices.html en/*` and `assets/site.*` (never hand-edit) · `olivane/`, `arclines/` (both owned by the owner; editable like the rest) · `vercel.json` `.vercelignore` (`source/` not published) · `favicon-192.png` `apple-touch-icon.png` `og-v3.png` `og-en-v1.png` · `LICENSE`.

## 5. Brand assets
- Logo: `assets/df-mark.png` (145×121, transparent, extracted from `favicon-192.png`; white "df" + small gold corner; always on black; never redraw/recolour). **Original WhatsApp JPEG is not in the repo → transfer separately if wanted.**
- Images: `assets/olivane-d|m.webp`, `arclines-d|m.webp`, `olivane/img/*`, `arclines/assets/*`, OG images listed above.
- Fonts: `/fonts` (above). Gold Parthenon arch SVG kept only in `source/legacy/frame.svg.txt` (removed from live hero).

## 6. Design decisions
CONFIRMED (shipped, approved): all-dark system; surfaces `--s0..--s4`; cream is text only; gold `#C9A96E` (lt `#D9BE86`, soft `#E6CF9F`) selective; pill buttons (gold gradient primary); glass header with capsule nav ≥1280px, burger below; Noto Serif Display headings with one gold italic emphasis word; Manrope body; Marcellus wordmark; frame motif (gold outline + crop marks) only on project previews; reduced-motion respected; 560/760/900/1000/1040 breakpoints (DESIGN.md).
REJECTED: Parthenon arc in hero (ported 1:1, reverted, then removed as "decoration with no information"); earlier warm cream/olive editorial look (superseded).
Under consideration: none recorded. Any other references/URLs from the original brief: UNKNOWN (no research links are stored anywhere accessible).

## 7. Business content (as live; Prices VERIFIED)
- Services on site: Business websites (up to 3 pages, mobile-first, contact form, Google Maps, local SEO basics); E-commerce (Viva Wallet/Stripe, COD + flat-rate shipping, up to 5 sample products); Custom solutions (quoted).
- Prices (no VAT; do not change without owner): website €300 one-time; hosting+domain €50/yr (required); maintenance €20/mo (optional); first year €350. E-shop setup €200–300; subscription €30–50/mo, 12-month minimum; first year €560–900. Skroutz/BestPrice €150, BOX NOW €120 (optional). Referral: €50 cash or 2 months free maintenance; friend 10% off. Extra products: client adds via video tutorials (no paid upload add-on). Note: an older Project description still lists €290–390 / €49–69 / extra products €2/item — **outdated**, owner confirmed 200–300 / 30–50 on 2026-11-11.
- Delivery: 3–5 days. Free demo before payment ("don't like it, pay nothing").
- Process, 5 steps (website and e-shop variants): Discover (day 1) → Concept (1–2) → Design & Build (2–4) → Refine & Test (4) → Launch (5).
- Contact: Instagram DM @athens.digitalframe; WhatsApp/phone +30 698 186 2732; email athens.digitalframe@gmail.com. Base Athens; languages Greek, English.
- FAQ (live): websites, e-commerce, pricing, hosting/maintenance (domain owned by client, in their name), process, ownership/support, referral. Full text lives in `build.py`/`legacy/faq.html`; English text mirrored in `en/index.html`.
- Studio description: small Athens studio, no published real-client work, shows labelled concept projects.
- Rules: never invent clients, reviews, results, founders, history. Greek copy is primary; mirror every change in EN.

## 8. Existing functionality (VERIFIED)
Language switch EL/EN; sticky glass header, burger sheet, scroll-spy; reveal animations; process tabs (website/e-shop, keyboard support); FAQ details/summary; contact form with validation → WhatsApp/mail handoff; SEO basics (titles, meta descriptions, hreflang, sitemap, OG images); no analytics/cookies/consent; no backend.

## 9. Portfolio projects
Both are **self-initiated fictional concepts** and labelled so on the site; testimonials/stats/news in Arclines are samples.
- **Olivane Estate** (real-estate, Cyprus): scroll-driven build story blueprint→home, property cards with filters, site-visit/brochure forms (demo, nothing sent). Many polish commits (AVIF, plan viewer, glass menu).
- **Arclines Freight** (logistics, APAC): corporate site, services/industries, shipment tracking, sample testimonials/news/FAQ, quote form (demo). Mobile audit fixes done (`79d6dbb`). Phone mockup on home page appears black in screenshots — uninvestigated.

## 10. Research/references
None recorded in accessible sources. UNKNOWN; obtain from the original brief.

## 11. Known issues
Arclines mockup black in home hero screenshot; 14 tap-target items in demos; legal pages missing; no Lighthouse/screen-reader/real-device pass; contrast/forms audits not re-run after `2226bab`; Project memory `areas/company-website.md` mentions a Base44 site (conflicts with the Vercel repo; unresolved); `CLAUDE.md` says push only after user consent, memory says only after "загрузи"/"push".

## 12. Decisions / must not undo
Don't touch prices or header copy without approval; don't reintroduce arc/decoration; generated files only via `build.py`; one commit per change; merge `origin/main` before pushing (in case another machine pushed independently); narrow reading of "undo/remove" (revert only last commit and say so); reply in user's language (Russian), short; show options before layout trade-offs. Commit messages end with the Co-Authored-By and Claude-Session lines.

## 13. Remaining tasks (priority)
1. Obtain the original master brief and reconcile (six services, references).
2. Re-run contrast/overflow/menu/form audits on the current build, incl. `/en/` at 390 and 1440.
3. Resolve Base44 vs Vercel question with the user.
4. Fix Arclines black mockup in home hero.
5. Legal pages (privacy, terms) and decision on analytics/consent if added.
6. Demo tap-target fixes.
7. Lighthouse, screen-reader and real-device checks.
8. Update outdated pricing in the Claude Project description (with owner approval).

## 14. Where work stopped
Hero fit task done and pushed (`2226bab`). Next: ask the user for the master prompt and confirm priorities; then task 2 above.

## 15. Uncertainty summary
UNKNOWN: master prompt content, six services, reference sites, Base44 status, three.js use in Olivane, real analytics/search-console setup. REPORTED: demo tap-target count. Everything else above was inspected in the repo this session.
