# Freshley

Subscription-based daily home delivery of fresh organic vegetables, leafy greens and fruits. Built for urban Indian families, mobile-first.

Full project brief, brand tokens and working rules live in [CLAUDE.md](CLAUDE.md).

## Stack

- React + Vite (JSX)
- Tailwind CSS v4 via `@tailwindcss/vite`
- [Motion](https://motion.dev) for animation
- No backend — "Subscribe" and "Notify me" open a prefilled WhatsApp chat instead of submitting to a server

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run lint      # oxlint
```

## Project structure

```
src/
  sections/     one component per page section, stacked in App.jsx
  components/   shared UI (Button, Section, Reveal, ProduceCard, ProduceScene, ...)
  hooks/        useComboBuilder (shared box-builder store), useMiniCart, useRevealVariants
  data/         produce.js, plans.js, faqs.js, farms.js, testimonials.js, presets.js,
                pincodes.js, site.js (business contact/WhatsApp/legal config),
                hero-scene.json (hero produce layout)
  utils/        whatsapp.js — builds the wa.me prefilled messages
  assets/produce/  hero photo cutouts (WebP) + CREDITS.md for sources/licence
```

## Where things stand

- The daily box (ComboBuilder), plans, delivery-area check, and the WhatsApp
  hand-off are functionally complete against a placeholder dataset.
- The hero is a 2.5D scene built from real photo cutouts (Motion-driven
  parallax/tilt), not 3D — see the "Hero" note in CLAUDE.md for why.
- **Before this goes live**, replace every placeholder listed in
  [TODO-content.md](TODO-content.md) (WhatsApp number, prices, FSSAI licence,
  farms, testimonials, etc.) and [TODO-images.md](TODO-images.md) (farm
  photos, optional real produce photography). Sample/invented data is flagged
  `sample: true` in its data file and shows a **SAMPLE** tag in `npm run dev`
  only — it's stripped from production builds, but the underlying data still
  needs replacing.
