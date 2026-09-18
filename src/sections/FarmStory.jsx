import { motion, useReducedMotion } from 'motion/react'
import { farms, todaysHarvest } from '../data/farms'

const gradients = [
  'from-leaf/40 via-lime/40 to-cream',
  'from-lime/50 via-cream to-leaf/25',
  'from-leaf/25 via-cream to-lime/40',
]

function FarmCard({ farm, gradientClass }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-leaf/15 bg-surface shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div
        className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${gradientClass}`}
      >
        <span className="font-emoji text-5xl" role="img" aria-label={`Placeholder photo for ${farm.farmerName}`}>
          🌾
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-soil/70 px-3 py-1 text-[11px] font-medium text-cream">
          Photo coming soon
        </span>
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-soil">{farm.farmerName}</h3>
          <p className="text-sm text-secondary">
            {farm.village} · {farm.distanceKm} km from the city
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {farm.grows.map((crop) => (
            <span
              key={crop}
              className="rounded-full bg-lime/20 px-2.5 py-1 text-xs font-medium text-leaf"
            >
              {crop}
            </span>
          ))}
        </div>

        <p className="text-sm font-semibold text-muted">Organic since {farm.organicSince}</p>
      </div>
    </div>
  )
}

function HarvestTicker() {
  const reduceMotion = useReducedMotion()
  const looped = [...todaysHarvest, ...todaysHarvest]

  return (
    <div className="relative mt-16 overflow-hidden rounded-2xl border border-leaf/15 bg-surface py-4 shadow-soft">
      <p className="mb-2 px-6 text-xs font-semibold uppercase tracking-wide text-leaf">
        Today&rsquo;s harvest
      </p>
      <motion.div
        className="flex w-max gap-8 px-6"
        animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={reduceMotion ? undefined : { duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {looped.map((entry, index) => (
          <span key={index} className="font-emoji whitespace-nowrap text-sm font-medium text-secondary">
            {entry}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function FarmStory() {
  return (
    <section
      id="farm-story"
      className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-16 lg:py-24"
    >
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-soil sm:text-4xl">
          Know your farmer
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-secondary">
          Every box traces back to a real farm we visit, not a warehouse.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm, index) => (
          <FarmCard key={farm.id} farm={farm} gradientClass={gradients[index % gradients.length]} />
        ))}
      </div>

      <HarvestTicker />
    </section>
  )
}

export default FarmStory
