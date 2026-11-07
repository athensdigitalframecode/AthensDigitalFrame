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
