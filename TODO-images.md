# TODO: Images to replace

Placeholder gradient blocks currently stand in for real photography. Swap
these out before launch. (All other placeholder content is tracked in
[TODO-content.md](TODO-content.md).)

## Hero produce cutouts — `src/assets/produce/*.webp`

Done with Pixabay stock (free for commercial use, sources in
`src/assets/produce/CREDITS.md`). Optional upgrade: replace with cutouts of
your own produce — shoot on plain white, then run them through the same
`rembg` step. Keep the same file names and the scene picks them up.

## Farm cards — `src/sections/FarmStory.jsx`, data in `src/data/farms.js`

- [ ] Ramulu Naidu — Chittoor — farmer/farm photo
- [ ] Lakshmi Devi — Medak — farmer/farm photo
- [ ] Venkatesh Reddy — Anantapur — farmer/farm photo

**How to swap:** save real photos as `src/assets/farms/<farm-id>.jpg`
(e.g. `ramulu.jpg`, matching each farm's `id` in `src/data/farms.js`), import
them in `FarmStory.jsx`, and replace the gradient placeholder `<div>` in
`FarmCard` with an `<img>` — keep the existing `aspect-[4/3]` and
`rounded-3xl` (on the wrapper) classes so the layout doesn't shift. Aim for
photos at least 800×600px, landscape orientation, and write real `alt` text
describing the farmer/farm instead of the current placeholder label.
