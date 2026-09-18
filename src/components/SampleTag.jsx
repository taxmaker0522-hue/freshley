// Dev-only marker for placeholder content. Renders nothing in production builds.
function SampleTag({ className = '' }) {
  if (!import.meta.env.DEV) return null
  return (
    <span
      className={`inline-flex items-center rounded-full bg-error/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-error ${className}`}
      title="Placeholder content — replace before launch (see TODO-content.md)"
    >
      Sample
    </span>
  )
}

export default SampleTag
