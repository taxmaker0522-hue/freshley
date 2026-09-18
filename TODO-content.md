# TODO: Placeholder content to replace before launch

Business details live in `src/data/site.js`. Invented content is flagged
`sample: true` in its data file and shows a red **SAMPLE** tag in
`npm run dev` only (never in the production build). Tick each item off as
real data lands.

## `src/data/site.js`

- [ ] `whatsappNumber` — the business WhatsApp. Used by Subscribe to this box,
      Notify me, the floating button and the footer.
- [ ] `phone` — display + `tel:` value
- [ ] `email`
- [ ] `fssaiLicence` — your 14-digit FSSAI licence number (footer). This is a
      legal requirement for a food business; do not launch with the sample.
- [ ] `social.instagram`, `social.facebook`, `social.x`
- [ ] `legal.privacy`, `legal.terms`, `legal.refund` — currently `#`; need real pages

## `src/data/plans.js`

- [ ] `basePrice` for Trial week / Monthly / Quarterly — invented numbers
- [ ] `householdSizes[].multiplier` — invented scaling
- [ ] `features` copy (swap counts, pause days) — confirm against real policy

## `src/data/farms.js` (`sample: true`)

- [ ] 3 farms — names, villages, distances, crops, organic-since are all invented
- [ ] Farm photos — see [TODO-images.md](TODO-images.md)
- [ ] `todaysHarvest` — should come from real daily data (or be dropped)

## `src/data/testimonials.js` (`sample: true`)

- [ ] 6 reviews — invented. Replace with real, consented customer quotes.
      Do not launch with fabricated reviews.

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
      Add an `icon` React component per item in `produce.js`; `ProduceGlyph`
      already prefers `icon` over `emoji`, so no component changes are needed.
- [ ] Hero produce photos — the cutouts in `src/assets/produce/` are Pixabay
      stock (see `CREDITS.md` there). Swapping in photos of *your* actual
      produce, shot on white and cut out the same way, would make the hero
      unmistakably yours.
