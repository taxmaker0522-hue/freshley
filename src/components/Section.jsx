import { Reveal } from './Reveal'

const bands = {
  none: '',
  surface: 'bg-surface/60',
  lime: 'bg-lime/10',
}

const widths = {
  default: 'max-w-7xl',
  prose: 'max-w-3xl',
  narrow: 'max-w-2xl',
}

function Section({
  id,
  band = 'none',
  width = 'default',
  eyebrow,
  title,
  intro,
  align = 'center',
  className = '',
  children,
}) {
  const centered = align === 'center'

  return (
    <section id={id} className={`relative scroll-mt-24 ${bands[band]} ${className}`}>
      <div className={`relative mx-auto ${widths[width]} px-4 py-8 sm:px-6 sm:py-12 lg:px-16 lg:py-16`}>
        {title && (
          <Reveal className={centered ? 'text-center' : 'text-left'}>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">{eyebrow}</p>
            )}
            <h2 className="mt-2 font-heading text-3xl font-semibold text-soil sm:text-4xl">{title}</h2>
            {intro && (
              <p className={`mt-3 max-w-lg text-secondary ${centered ? 'mx-auto' : ''}`}>{intro}</p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}

export default Section
