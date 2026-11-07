# Athens Digital Frame: DESIGN.md (editorial system, 2026-11)

Warm, editorial, restrained. Replaces the earlier dark/gold look (kept for reference in `legacy/DESIGN-dark-gold.md`).
Every visual decision needs a purpose. No generic SaaS look: no gradient hero, no glass, no icon cards, no floating decoration.

## Tokens (all in `editorial/site.css` :root)
- Colour: `--bg #F4EFE6` warm off-white, `--paper #EBE4D6` alternate sections, `--ink #1F1E1B` charcoal text and dark sections, `--muted #5C584D`, accent `--olive #56653A` (deep `#3E4A28`, on dark `#B9C48A`). Error `#9B2D20`. Do not add colours.
- Type: headlines Noto Serif Display 500 (italic 400 for the olive emphasis word), body Manrope 400-700, wordmark Marcellus. All self-hosted in `/fonts` (Greek + Latin). Scale `--fs-0..4` (clamp). Eyebrows 12px, caps, .2em tracking.
- Spacing 4/8/12/16/24/32/48/72/112, container 1200px + `--pad`, radius 2px (almost square), hairline borders `1px var(--line)`.
- Breakpoints: 560, 760, 900, 1000, 1040 (desktop nav).

## Frame motif
`.fr` = offset outline + four olive crop-mark corners around images and device mockups. Use it for project previews, not for text cards.

## Components
Buttons `.btn` (ink), `.olive` (primary CTA), `.ghost`; on `.dark` they invert. Tags `.tag2` (`req` filled = mandatory, `opt` dashed = optional). Rows `.row` for prices. Details/summary FAQ. Tabs with arrow-key support for the process.

## Motion
Fade/lift on reveal (`.rv`), image clip reveal, process line draws once. Everything off under `prefers-reduced-motion`. No parallax, no scroll hijack.

## Content rules
- Prices (do not change without the owner): website 300 EUR (up to 3 pages), hosting+domain 50 EUR/year (required), maintenance 20 EUR/month (optional), e-shop setup 200-300 EUR, subscription 30-50 EUR/month with 12-month minimum, first-year e-shop 560-900 EUR, Skroutz 150, BOX NOW 120, referral 50 EUR or 2 months free (friend 10% off). No VAT.
- Never invent clients, reviews, results, founders or history. Olivane and Arclines are labelled self-initiated fictional concepts.
- The contact form has no backend: it hands a prepared message to WhatsApp or the mail app and says so.
- Legal pages do not exist yet: footer shows clearly marked "coming soon" placeholders, not links.
- Every page exists in Greek (root) and English (`/en/`), both generated; keep copy in sync via `t(el, en)`.
