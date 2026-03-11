# LoveLink - Zekra Template (v2)

Production-ready mid-tier romantic mini-site template for **Zekra / ذكرى**.

## Chosen Stack and Why

- **Vite + React + TypeScript**: fast dev/build cycle, clean component model, easy to maintain as a business product.
- **Tailwind CSS v4**: rapid, consistent mobile-first spacing and visual hierarchy.
- **Framer Motion**: smooth motion system for interactive romantic moments without heavy overhead.
- **Local font packages**: stable delivery for script-like English headers and graceful Arabic typography.

This keeps the same engineering model as `Lamsa` while allowing richer interactions for the Zekra tier.

## What Zekra Includes

- Heart-centered date password gate
- Short animated panda bridge scene after unlock (GIF-supported)
- Romantic hero section
- Live love counter (years, months, hours, minutes, seconds)
- 3 hidden/flippable message cards with smooth mobile swipe
- 6 photo memories with captions and love-emoji burst interaction
- Full-page final message reveal modal
- Ambient romantic particles and polished section transitions

## Run Locally

From repo root:

```bash
cd zekra
```

Install and run:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Where to Replace Customer Data

Edit:

`src/content/zekra.config.ts`

Replace these fields:

- `receiverName`
- `senderName`
- `unlockDate.year`
- `unlockDate.month`
- `unlockDate.day`
- `introLine`
- `loadingGifSrc` and `loadingGifAlt` (optional but recommended)
- `messages` (exactly 3)
- `photos` (exactly 6; each with `src` + `caption`)
- `finalFloatingMessage`
- `finalFloatingLines` (optional line-by-line reveal control)
- `locale` (`'ar'` or `'en'`)
- optional `theme` overrides

## Where to Replace Images, Captions, Messages, Date, Password

- Image files: `public/images/zekra/`
- Loading GIF: `public/images/zekra/hug-love.gif` (or update `loadingGifSrc`)
- Photo paths/captions: `src/content/zekra.config.ts` -> `photos`
- Card messages: `src/content/zekra.config.ts` -> `messages`
- Unlock password date: `src/content/zekra.config.ts` -> `unlockDate`
- Final floating message: `src/content/zekra.config.ts` -> `finalFloatingMessage`
- Final message lines (optional): `src/content/zekra.config.ts` -> `finalFloatingLines`

## Folder Structure

```text
src/
  content/zekra.config.ts
  types/zekra.ts
  shared/
    AmbientRomance.tsx
    GlassPanel.tsx
    GlowButton.tsx
    SectionBlock.tsx
  templates/zekra/
    ZekraExperience.tsx
    copy.ts
    flow/
      HeartDateGate.tsx
      PandaBridge.tsx
    sections/
      HeroSection.tsx
      MessageDeck.tsx
      PhotoMemories.tsx
      FloatingFinalMessage.tsx
```

## Theme Customization

Main tokens are in `src/style.css`:

- `--rose-main`, `--rose-deep`
- `--gold-accent`
- `--bg-void`, `--bg-card`, `--bg-card-soft`
- `--ink-main`, `--ink-soft`, `--ink-muted`

Optional per-customer override is available in `src/content/zekra.config.ts` via `theme`.

## Notes

- This package is intentionally richer than Lamsa, but still not full premium tier.
- Runtime validation ensures required content counts are correct:
  - exactly 3 messages
  - exactly 6 photos
