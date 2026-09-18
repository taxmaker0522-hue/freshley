import { useRef } from 'react'
import { motion, useReducedMotion, useScroll } from 'motion/react'

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

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

function HowItWorks() {
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.4'],
  })

  const itemVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-16 lg:py-24"
    >
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-soil sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-md text-secondary">
          From your box to your doorstep, in four simple steps.
        </p>
      </div>

      <div ref={containerRef} className="relative mt-16">
        <div className="pointer-events-none absolute left-6 top-6 bottom-6 w-0.5 bg-leaf/15 md:hidden">
          <motion.div
            className="h-full w-full origin-top bg-leaf"
            style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
          />
        </div>

        <div className="pointer-events-none absolute left-6 right-6 top-6 hidden h-0.5 bg-leaf/15 md:block">
          <motion.div
            className="h-full w-full origin-left bg-leaf"
            style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
          />
        </div>

        <motion.div
          className="relative flex flex-col gap-10 md:flex-row md:justify-between md:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:px-4 md:text-center"
            >
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-cream bg-leaf text-cream shadow-soft">
                <step.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-leaf">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold text-soil">{step.title}</h3>
                <p className="mt-1 max-w-56 text-sm text-secondary">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
