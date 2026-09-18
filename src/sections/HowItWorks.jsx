import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { RevealGroup, RevealItem } from '../components/Reveal'
import Section from '../components/Section'

function BoxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.5 8.5 12 4l8.5 4.5L12 13 3.5 8.5Z" />
      <path d="M3.5 8.5V16L12 20.5 20.5 16V8.5" />
      <path d="M12 13v7.5" />
    </svg>
  )
}

function PlanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M8 9h8M8 12.5h8M8 16h5" />
    </svg>
  )
}

function HarvestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 17h16" />
      <path d="M6.5 17a5.5 5.5 0 0 1 11 0" />
      <path d="M12 7V4" />
      <path d="M8 10 6.3 8.3M16 10l1.7-1.7" />
    </svg>
  )
}

function DoorIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" />
      <path d="M3 21h18" />
      <path d="M14.5 12.5v.01" />
    </svg>
  )
}

const steps = [
  {
    icon: BoxIcon,
    title: 'Build your box',
    description: 'Pick your vegetables, greens and fruits — or start from a preset.',
  },
  {
    icon: PlanIcon,
    title: 'Choose a plan',
    description: 'Trial week, monthly or quarterly. Pause or skip anytime.',
  },
  {
    icon: HarvestIcon,
    title: 'We harvest at dawn',
    description: 'Your order is picked fresh from the farm before sunrise.',
  },
  {
    icon: DoorIcon,
    title: 'At your door by 8 am',
    description: 'Delivered in a returnable crate, before your day begins.',
  },
]

function HowItWorks() {
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.4'],
  })
  const headPosition = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="From the field to your kitchen"
      intro="Four steps, one morning. No warehouse in between."
    >
      <div ref={containerRef} className="relative mt-16">
        <div className="pointer-events-none absolute left-6 top-6 bottom-6 w-0.5 bg-leaf/15 md:hidden">
          <motion.div
            className="h-full w-full origin-top bg-leaf"
            style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
          />
          {!reduceMotion && (
            <motion.span
              className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_0_4px_rgb(163_217_119/0.35)]"
              style={{ top: headPosition }}
            />
          )}
        </div>

        <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden h-0.5 bg-leaf/15 md:block">
          <motion.div
            className="h-full w-full origin-left bg-leaf"
            style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
          />
          {!reduceMotion && (
            <motion.span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_0_4px_rgb(163_217_119/0.35)]"
              style={{ left: headPosition }}
            />
          )}
        </div>

        <RevealGroup className="relative flex flex-col gap-12 md:grid md:grid-cols-4 md:gap-6" stagger={0.12}>
          {steps.map((step, index) => (
            <RevealItem key={step.title}>
              <div className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:px-2 md:text-center">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-cream bg-leaf text-cream shadow-soft">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-leaf">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-soil">{step.title}</h3>
                  <p className="mt-1 max-w-56 text-sm text-secondary md:mx-auto">{step.description}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  )
}

export default HowItWorks
