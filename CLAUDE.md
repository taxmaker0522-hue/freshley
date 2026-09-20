# Freshley

Subscription-based daily home delivery of fresh organic vegetables, leafy greens and fruits.

**Audience:** Urban Indian families, mostly on mobile.
**Tone:** Warm, honest, farm-fresh, premium but not expensive-looking.

## Stack

- React + Vite — JSX, not TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- Motion — `import { motion } from "motion/react"` (not `framer-motion`)
- Hero "3D" is a 2.5D scene of real photo cutouts (`src/assets/produce/*.webp`, layout in `src/data/hero-scene.json`) driven by Motion — no three.js
- I work on Windows / PowerShell: use PowerShell-safe commands, no bash-only syntax.

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
- Keep colours, spacing and type in the Tailwind theme / CSS variables so the look stays consistent

## How to work

- Budget: prefer free / open-source tools. Ask before adding anything paid.
- Build one section at a time (navbar, hero, features, etc.).
- For any big change, give a 3–5 bullet plan first. Do not refactor unrelated files.
- Ask before installing a new package, and say roughly what it adds to bundle size.
- After each section, run `npm run build` and fix errors before moving on.
- Never say "done" until the checks in "Definition of done" pass.

## Git safety

- Commit after each working section: `git add -A` then `git commit -m "short message"`.
- Never commit `.env`, API keys, `node_modules` or `dist`. Keep them in `.gitignore`.

## Rules

- Mobile-first: design at 375px first, then 768px, then 1280px; check the result at 375px and 1280px
- Prices in ₹
- All animation respects `prefers-reduced-motion`
- The hero produce scene renders as a static composition under `prefers-reduced-motion`; no device-capability gating
- Compress images, lazy-load below-the-fold images, and set `width` and `height` on every image
- Produce cutouts come from Pixabay (Pixabay Content License) — sources in `src/assets/produce/CREDITS.md`
- One section per component, in `src/sections/`
- Shared data (vegetables, plans, FAQs) lives in `src/data/*.js`
- No lorem ipsum — write real copy and use real images only
- Always use the ui-ux pro max skill

## Deployment

- If using React Router, add an SPA rewrite (`vercel.json` or `public/_redirects`).
- Set page title, meta description, favicon and a social preview image.

## Definition of done

- `npm run build` passes with no errors.
- No console errors or warnings in the browser.
- Screenshots reviewed at 375px and 1280px.
- Finish with a short report: what changed, what to test, known issues.
