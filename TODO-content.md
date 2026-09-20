# TODO: Placeholder content to replace before launch

Business details live in `src/data/site.js`. Invented content lives in a
dev-only branch (`import.meta.env.DEV`) of its data file and is flagged
`sample: true`. **It is stripped from every production build** (`npm run build`,
`npm run build:html`, and any deploy) - the text does not even ship in the
JavaScript. While a section has no real data, the section, its nav/footer links
and the harvest ticker simply do not render. In `npm run dev` the samples still
show with a red **SAMPLE** tag so the layout can be reviewed.

To make something live, add real entries to the `real*` array at the top of
`src/data/farms.js` / `src/data/testimonials.js` (the samples stay dev-only).
Tick each item off as real data lands.

## `src/data/site.js`

- [ ] `WHATSAPP_NUMBER` (top of the file — the one line to edit). Drives the
      floating button, Subscribe to this box, Notify me and the footer links.
      **Still a dummy number, so messages go nowhere real until you change it.**
- [ ] `fssaiLicence` — your 14-digit FSSAI licence number. Currently empty, so
      the footer badge is hidden. This is a legal requirement for a food
      business; fill it in with your real number (check with a professional).
- [ ] `phone` — display + `tel:` value (still a dummy, still shown in the footer)
- [ ] `email` (still a dummy, still shown in the footer)
- [ ] `social.instagram`, `social.facebook`, `social.x` — invented handles,
      still linked from the footer
- [ ] `legal.privacy`, `legal.terms`, `legal.refund` — currently `#`; need real pages

## `src/data/plans.js`

- [ ] `basePrice` for Trial week / Monthly / Quarterly — invented numbers
- [ ] `householdSizes[].multiplier` — invented scaling
- [ ] `features` copy (swap counts, pause days) — confirm against real policy

## `src/data/farms.js` (`sample: true`)

- [ ] 3 farms — names, villages, distances, crops, organic-since are all invented
- [ ] Farm photos — see [TODO-images.md](TODO-images.md)
- [ ] `todaysHarvest` (`sample: true`, includes the "picked at 5:40 am" claim)
      — should come from real daily data (or be dropped)
- [ ] Until at least one real farm exists, the whole "Know your farmer"
      section and the "Farms" nav/footer links stay hidden in production

## `src/data/testimonials.js` (`sample: true`)

- [ ] 6 reviews — invented. Replace with real, consented customer quotes.
      Do not launch with fabricated reviews. Until one real review exists, the
      Reviews section stays hidden in production.

## `src/data/pincodes.js`

- [ ] `servicePincodes` — sample list across five cities

## `src/data/produce.js`

- [ ] `pricePerDay` and `unit` for all 30 items — rough estimates
- [ ] Telugu / Hindi names — verify spellings with a native speaker
- [ ] `seasonal` flags — confirm against your actual sourcing calendar

## `src/data/faqs.js`

- [ ] Answers reference policies (swaps, pause days, lab testing, auto-pay) —
      confirm each is true before launch

## Later prompts

- [ ] **SVG produce illustrations** — one consistent style for all 30 items.
      This is the durable fix for emoji: they look different on every device,
      several are approximations (okra 🌿, beetroot 🍠, all gourds 🥒), and
      newer ones don't exist on older phones. Add an `icon` React component per
      item in `produce.js`; `ProduceGlyph` already prefers `icon` over `emoji`,
      so no component changes are needed. (Interim: capsicum 🫑 and cluster
      beans 🫘 fall back to 🌶️ / 🌱 only on devices that can't draw them.)
- [ ] Hero produce photos — the cutouts in `src/assets/produce/` are Pixabay
      stock (see `CREDITS.md` there). Swapping in photos of *your* actual
      produce, shot on white and cut out the same way, would make the hero
      unmistakably yours.
