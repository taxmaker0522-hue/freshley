import { useRef, useState } from 'react'
import { testimonials } from '../data/testimonials'

function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8l-6.1 3.2 1.5-6.8-5.2-4.7 6.9-.7L12 2.5Z" />
    </svg>
  )
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-leaf/15 bg-surface p-6 shadow-soft">
      <div className="flex gap-1 text-leaf">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="h-4 w-4" />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-secondary">&ldquo;{testimonial.quote}&rdquo;</p>
      <div>
        <p className="text-sm font-semibold text-soil">{testimonial.name}</p>
        <p className="text-xs text-secondary">{testimonial.location}</p>
      </div>
    </div>
  )
}

function Testimonials() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function handleScroll() {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  function scrollToIndex(index) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-16 lg:py-24"
    >
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-soil sm:text-4xl">
          Families who switched
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-secondary">
          Real households, real boxes, delivered every morning.
        </p>
      </div>

      <div className="mt-10 md:hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full shrink-0 snap-center px-0.5">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-1.5">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-6 bg-leaf' : 'w-2 bg-leaf/25'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 hidden grid-cols-3 gap-6 md:grid">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}

export default Testimonials
