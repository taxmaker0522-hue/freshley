import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Button from '../components/Button'

const links = [
  { label: 'Build your box', href: '#combo-builder' },
  { label: 'Plans', href: '#plans' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Farms', href: '#farm-story' },
]

function LeafMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 20c1-8 7-14 15-15-1 8-7 14-15 15Z" fill="currentColor" />
      <path
        d="M5.5 18.5C9 15 13 11 18.5 5.5"
        className="stroke-cream"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2">
      <LeafMark className="h-8 w-8 text-leaf" />
      <span className="font-heading text-2xl font-semibold tracking-tight text-soil">
        Freshley
      </span>
    </a>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      id="top"
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'bg-cream/80 shadow-sm backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-16">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-secondary transition-colors hover:text-leaf"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button href="#plans" size="sm" className="hidden md:inline-flex">
          Start subscription
        </Button>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-soil md:hidden"
        >
          <span className="relative block h-4 w-6">
            <motion.span
              className="absolute left-0 top-0 h-0.5 w-6 rounded-full bg-soil"
              animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
            <motion.span
              className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full bg-soil"
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.15 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 w-6 rounded-full bg-soil"
              animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-leaf/15 bg-cream md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-full px-4 text-base font-medium text-secondary transition-colors hover:bg-lime/20 hover:text-leaf"
                >
                  {link.label}
                </a>
              ))}
              <Button href="#plans" onClick={() => setOpen(false)} className="mt-2 w-full">
                Start subscription
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
