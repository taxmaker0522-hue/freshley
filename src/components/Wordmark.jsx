// Two-tone "BoboBay" lockup (leaf green + tomato), matching the brand's
// promotional artwork. Reused in the navbar and footer; `dark` swaps the
// green for lime so it still reads clearly on the dark footer background,
// the same swap the footer's leaf icon already makes.
function Wordmark({ className = '', dark = false }) {
  return (
    <span className={`font-heading font-bold tracking-tight ${className}`}>
      <span className={dark ? 'text-lime' : 'text-leaf'}>Bobo</span>
      <span className="text-tomato">Bay</span>
    </span>
  )
}

export default Wordmark
