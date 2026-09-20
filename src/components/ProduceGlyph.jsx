import { isEmojiSupported } from '../utils/emoji'

// Renders a produce item's `icon` component when one exists, else its emoji,
// else `emojiFallback` when this device cannot draw the emoji.
function ProduceGlyph({ item, className = 'text-3xl', iconClassName = 'h-9 w-9' }) {
  if (item.icon) {
    const Icon = item.icon
    return <Icon className={iconClassName} aria-hidden="true" />
  }

  const glyph =
    item.emojiFallback && !isEmojiSupported(item.emoji) ? item.emojiFallback : item.emoji

  return (
    <span className={`font-emoji ${className}`} aria-hidden="true">
      {glyph}
    </span>
  )
}

export default ProduceGlyph
