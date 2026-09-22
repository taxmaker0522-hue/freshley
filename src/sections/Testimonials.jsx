import { useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { RevealGroup, RevealItem } from '../components/Reveal'
import SampleTag from '../components/SampleTag'
import Section from '../components/Section'
import { liveTestimonials as testimonials } from '../data/testimonials'

const SLIDE_GAP = 16

function TestimonialCard({ testimonial }) {
  return (
    <figure className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-leaf/15 bg-surface p-6 shadow-soft">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-4 font-heading text-8xl font-semibold leading-none text-lime/40"
      >
        &rdquo;
      </span>
      <blockquote className="relative flex-1 text-base leading-relaxed text-secondary">
        {testimonial.quote}
      </blockquote>
      <figcaption>
        <p className="flex items-center gap-2 text-sm font-semibold text-soil">
          {testimonial.name}
          {testimonial.sample && <SampleTag />}
        </p>
        <p className="text-xs text-secondary">{testimonial.location}</p>
      </figcaption>
    </figure>
  )
}

function Testimonials() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  function handleScroll() {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    setActiveIndex(Math.round(el.scrollLeft / (el.clientWidth + SLIDE_GAP)))
  }

  function scrollToIndex(index) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({
      left: index * (el.clientWidth + SLIDE_GAP),
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  if (testimonials.length === 0) return null

  return (
    <Section
      id="testimonials"
      band="lime"
      eyebrow="Reviews"
      title="Families who switched"
      intro="Real households, real baskets, delivered every week."
    >
      <div className="mt-10 md:hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full shrink-0 snap-center">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Go to review ${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? 'w-6 bg-leaf' : 'w-2 bg-leaf/25'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <RevealGroup className="mt-10 hidden grid-cols-3 gap-6 md:grid">
        {testimonials.map((testimonial) => (
          <RevealItem key={testimonial.id} className="h-full">
            <TestimonialCard testimonial={testimonial} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}

export default Testimonials
