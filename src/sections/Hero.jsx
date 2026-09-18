import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import BasketIllustration from '../components/BasketIllustration'
import Blob from '../components/Blob'
import Button from '../components/Button'

const VeggieScene = lazy(() => import('../three/VeggieScene'))

const trustChips = ['100% organic', 'Delivered by 8 am', 'Pause anytime']

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

function useCanShow3D() {
  const reduceMotion = useReducedMotion()
  const lowPower =
    typeof navigator !== 'undefined' &&
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency <= 4

  return !reduceMotion && !lowPower
}

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-lime/25 via-cream to-leaf/15 p-6">
      <BasketIllustration className="h-full w-auto max-w-full drop-shadow-[0_16px_24px_rgb(43_33_24/0.18)]" />
    </div>
  )
}

function Hero() {
  const canShow3D = useCanShow3D()
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-16"
    >
      <div className="relative order-1 lg:order-2">
        <Blob className="-inset-8" />
        <div className="relative h-[320px] w-full overflow-hidden rounded-2xl lg:h-[520px]">
          {canShow3D ? (
            <Suspense fallback={<SceneFallback />}>
              <VeggieScene />
            </Suspense>
          ) : (
            <SceneFallback />
          )}
        </div>
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
          Farm-fresh vegetables at your door, <em className="italic text-leaf">every morning</em>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-5 max-w-md text-lg text-secondary lg:mx-0"
        >
          Zero pesticides, picked yesterday, on your table before breakfast —
          straight from farms we know by name.
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
