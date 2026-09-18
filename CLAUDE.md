# Freshley

Subscription-based daily home delivery of fresh organic vegetables, leafy greens and fruits.

**Audience:** Urban Indian families, mostly on mobile.
**Tone:** Warm, honest, farm-fresh, premium but not expensive-looking.

## Stack

- React + Vite — JSX, not TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- Motion — `import { motion } from "motion/react"` (not `framer-motion`)
- Hero "3D" is a 2.5D scene of real photo cutouts (`src/assets/produce/*.webp`, layout in `src/data/hero-scene.json`) driven by Motion — no three.js

Any component pasted from 21st.dev must be converted to JSX and restyled to our tokens below — never used as-is.

## Brand tokens

| Token | Value | Use |
|---|---|---|
| Leaf green | `#2F7D32` | Primary |
| Fresh lime | `#A3D977` | Accent |
| Tomato | `#E4572E` | CTA highlights only |
| Cream | `#FAF7F0` | Background |
| Soil | `#2B2118` | Text |

- Headings: **Fraunces**
- Body: **Inter**
- Both from Google Fonts
- Rounded 2xl corners, soft shadows, lots of whitespace

## Rules

- Mobile-first: design at 375px first, then 768px, then 1280px
- Prices in ₹
- All animation respects `prefers-reduced-motion`
- The hero produce scene renders as a static composition under `prefers-reduced-motion`; no device-capability gating
- Produce cutouts come from Pixabay (Pixabay Content License) — sources in `src/assets/produce/CREDITS.md`
- One section per component, in `src/sections/`
- Shared data (vegetables, plans, FAQs) lives in `src/data/*.js`
- No lorem ipsum — write real copy
- Always use the ui-ux pro max skill
