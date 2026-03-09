# LoveLink - Lamsa Template (v1)

Production-ready romantic mini-site template for the **Lamsa / لمسة** package (100 EGP).

## Chosen Stack and Why

- **Vite + React + TypeScript**: fast local workflow, clean component composition, and safe reuse as the business scales to many customer pages.
- **Tailwind CSS (v4)**: quick, consistent mobile-first spacing and typography control with minimal CSS overhead.
- **Framer Motion**: smooth, restrained transitions for emotional polish without heavy animation complexity.
- **Local font packages (`@fontsource`)**: reliable typography delivery (English + Arabic) without external runtime font requests.

## What This Template Includes

- Password gate for private page access (frontend-only v1 protection)
- Intentional 2.8s anticipation reveal moment
- 5-section emotional flow:
  1. Intro / welcome
  2. Meaningful date
  3. Exactly 4 photo memories
  4. One message
  5. Gentle closing note
- Subtle romantic ambient particles
- Mobile-first responsive layout with bilingual locale support (`en`, `ar`)

## Run Locally

From repository root:

```bash
cd Lamsa
```

Then run:

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

Edit only:

`src/content/lamsa.config.ts`

Fields to replace:

- `password`
- `receiverName`
- `senderName`
- `meaningfulDate`
- `message`
- `photos` (must be exactly 4 image paths)
- `locale` (`'en'` or `'ar'`)

## Where to Replace Images

- Put customer photos in `public/images/lamsa/`
- Update the 4 paths in `src/content/lamsa.config.ts`

Current placeholders:

- `/images/lamsa/memory-01.svg`
- `/images/lamsa/memory-02.svg`
- `/images/lamsa/memory-03.svg`
- `/images/lamsa/memory-04.svg`

## Project Structure

```text
src/
  content/lamsa.config.ts
  types/gift.ts
  shared/
    AmbientParticles.tsx
    GlassCard.tsx
    PrimaryButton.tsx
    SectionShell.tsx
  templates/lamsa/
    LamsaExperience.tsx
    copy.ts
    flow/
      PasswordGate.tsx
      AnticipationReveal.tsx
    sections/
      WelcomeSection.tsx
      DateSection.tsx
      PhotosSection.tsx
      MessageSection.tsx
      ClosingSection.tsx
```

## Styling Customization

Primary theme and typography tokens live in:

`src/style.css`

Key variables:

- `--bg-shell`
- `--ink-main`
- `--ink-soft`
- `--rose-main`
- `--rose-soft`
- `--font-body`
- `--font-display`
- `--font-ar`

Adjusting these tokens and component class names is enough to create a distinct visual variant while keeping the same architecture.

## Reusing for Future Customers

For another Lamsa page:

1. Duplicate and edit `src/content/lamsa.config.ts` values
2. Replace the 4 image files/paths
3. Build and deploy

For future package tiers:

- Add sibling templates under `src/templates/`
- Reuse `src/shared/` primitives
- Keep each package's content contract separate in `src/types/` and `src/content/`

## Notes

- This tier is intentionally elegant but limited by design (no advanced interactivity, no multi-step story system, no video/QR/countdown features).
- Runtime guard in the experience checks that exactly 4 photos are provided.
