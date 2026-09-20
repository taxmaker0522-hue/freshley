const cache = new Map()

// Newer emoji (e.g. bell pepper, beans) draw as an empty "tofu" box on devices
// whose emoji font predates them (all of Windows 10, older Androids). A missing
// glyph renders as a monochrome box; a real emoji always has coloured pixels.
export function isEmojiSupported(emoji) {
  if (cache.has(emoji)) return cache.get(emoji)

  let supported = true
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.textBaseline = 'top'
    ctx.font = '28px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
    ctx.fillText(emoji, 0, 0)
    const { data } = ctx.getImageData(0, 0, 32, 32)

    supported = false
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
      if (a > 0 && (Math.abs(r - g) > 24 || Math.abs(g - b) > 24)) {
        supported = true
        break
      }
    }
  } catch {
    supported = true
  }

  cache.set(emoji, supported)
  return supported
}
