import { motion, useReducedMotion } from 'motion/react'
import Blob from '../components/Blob'
import Button from '../components/Button'
import ProduceScene from '../components/ProduceScene'
import { delivery } from '../data/site'

const trustChips = ['Harvested at fresh water sources', 'Hand-graded & sorted', `Delivered ${delivery.day}, ${delivery.time}`]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-16"
    >
      <div className="relative order-1 lg:order-2">
        <Blob className="inset-4" />
        <ProduceScene />
      </div>

      <motion.div
        className="order-2 text-center lg:order-1 lg:text-left"
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
        variants={containerVariants}
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-semibold leading-[1.1] text-soil sm:text-5xl lg:text-display"
        >
          Farm-fresh vegetables at your door, <em className="italic text-leaf">ready for your week</em>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-5 max-w-md text-lg text-secondary lg:mx-0"
        >
          Harvested at fresh water sources, hand-graded and sorted, then delivered every{' '}
          {delivery.day} morning, {delivery.time} — straight from farms we know by name.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
        >
          <Button href="#combo-builder" className="w-full sm:w-auto">
            Build my box
          </Button>
          <Button href="#plans" variant="secondary" className="w-full sm:w-auto">
            See plans
          </Button>
        </motion.div>

        <motion.ul
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
        >
          {trustChips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-leaf/25 bg-lime/15 px-4 py-1.5 text-sm font-medium text-leaf"
            >
              {chip}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}

export default Hero
