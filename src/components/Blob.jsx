// Decorative static glow. Hidden under 400px (or under lg with from="lg");
// keep it out from behind body text.
function Blob({ className = '', from = 'sm' }) {
  const show = from === 'lg' ? 'lg:block' : 'min-[400px]:block'
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden rounded-full bg-lime opacity-[0.12] blur-3xl ${show} ${className}`}
    />
  )
}

export default Blob
