# Freshley

Subscription-based daily home delivery of fresh organic vegetables, leafy greens and fruits.

**Audience:** Urban Indian families, mostly on mobile.
**Tone:** Warm, honest, farm-fresh, premium but not expensive-looking.

## Stack

- React + Vite — JSX, not TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- Motion — `import { motion } from "motion/react"` (not `framer-motion`)
- React Three Fiber + drei for 3D

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
- 3D canvas is lazy-loaded and replaced by a static image on low-end devices
- One section per component, in `src/sections/`
- Shared data (vegetables, plans, FAQs) lives in `src/data/*.js`
- No lorem ipsum — write real copy
- Always use the ui-ux pro max skill
