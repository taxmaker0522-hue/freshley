import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { RevealGroup, RevealItem } from '../components/Reveal'
import Section from '../components/Section'
import { delivery } from '../data/site'

function WaterDropIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5c3.2 3.6 5 6.4 5 9a5 5 0 1 1-10 0c0-2.6 1.8-5.4 5-9Z" />
      <path d="M9.8 13.5a2.4 2.4 0 0 0 2 2.2" />
    </svg>
  )
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function BadgeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l2.2 2.1 3-.4.6 3 2.7 1.5-1.1 2.8 1.1 2.8-2.7 1.5-.6 3-3-.4L12 21l-2.2-2.1-3 .4-.6-3-2.7-1.5 1.1-2.8-1.1-2.8 2.7-1.5.6-3 3 .4L12 3Z" />
      <path d="M8.5 12.5l2.3 2.3 4.7-5.1" />
    </svg>
  )
}

function CrateIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="8" width="17" height="11" rx="1.5" />
      <path d="M3.5 12.5h17M8 8V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M9 12.5V19M15 12.5V19" />
    </svg>
  )
}

function SunriseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 18h14" />
      <path d="M7.5 18a4.5 4.5 0 0 1 9 0" />
      <path d="M12 8.5V5.5M6 12l-1.8-1.2M18 12l1.8-1.2M4 15h1.5M18.5 15H20" />
    </svg>
  )
}

function CalendarCheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
      <path d="M9.5 14.5l2 2 3.5-3.7" />
    </svg>
  )
}

const features = [
  {
    icon: WaterDropIcon,
    title: 'Harvested at fresh water sources',
    description: 'Our vegetables are harvested at farms that sit on fresh water sources.',
  },
  {
    icon: ClockIcon,
    title: 'Harvested within 24 hours',
    description: 'Picked at the farm the evening before it reaches you.',
  },
  {
    icon: BadgeIcon,
    title: 'Hand-graded & sorted',
    description: 'Every piece is checked by hand, so only the best goes into your crate.',
  },
  {
    icon: CrateIcon,
    title: 'Zero-plastic returnable crates',
    description: 'Delivered in reusable crates we collect back — no plastic bags.',
  },
  {
    icon: SunriseIcon,
    title: `Next-morning delivery, ${delivery.time}`,
    description: 'Weekly, on the day you choose — on your doorstep before the day gets going.',
  },
  {
    icon: CalendarCheckIcon,
    title: 'Pick your box every week',
    description: `Change your picks any time until ${delivery.cutoff}.`,
  },
]

function TiltCard({ icon: Icon, title, description }) {
  const reduceMotion = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 300, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 300, damping: 22 })

  function handleMouseMove(event) {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 14)
    rotateX.set(py * -14)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className="flex h-full flex-col items-center gap-3 rounded-2xl border border-leaf/15 bg-surface p-4 text-center shadow-soft transition-shadow duration-200 will-change-transform hover:shadow-lift lg:p-5"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime/20 text-leaf shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="text-base font-semibold leading-snug text-soil">{title}</h3>
      <p className="text-sm leading-snug text-secondary">{description}</p>
    </motion.div>
  )
}

function TrustStrip() {
  return (
    <Section id="trust" band="surface">
      <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {features.map((feature) => (
          <RevealItem key={feature.title} className="h-full">
            <TiltCard {...feature} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}

export default TrustStrip
