// Renders a produce item's `icon` component when one exists, else its emoji.
function ProduceGlyph({ item, className = 'text-3xl', iconClassName = 'h-9 w-9' }) {
  if (item.icon) {
    const Icon = item.icon
    return <Icon className={iconClassName} aria-hidden="true" />
  }
  return (
    <span className={`font-emoji ${className}`} aria-hidden="true">
      {item.emoji}
    </span>
  )
}

export default ProduceGlyph
