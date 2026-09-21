import { motion, useReducedMotion } from 'motion/react'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'
import SampleTag from '../components/SampleTag'
import Section from '../components/Section'
import { liveFarms, todaysHarvest } from '../data/farms'

const gradients = [
  'from-leaf/40 via-lime/40 to-cream',
  'from-lime/50 via-cream to-leaf/25',
  'from-leaf/25 via-cream to-lime/40',
]

const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
}

function FarmCard({ farm, gradientClass }) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-leaf/15 bg-surface shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div
        className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${gradientClass}`}
        role="img"
        aria-label={`Placeholder photo for ${farm.farmerName}`}
      >
        <div className="absolute inset-0 opacity-25 mix-blend-multiply" style={grain} aria-hidden="true" />
        <span className="font-heading text-7xl font-semibold text-leaf/40" aria-hidden="true">
          {farm.farmerName[0]}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-soil/70 px-3 py-1 text-xs font-medium text-cream">
          Photo coming soon
        </span>
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div>
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-soil">
            {farm.farmerName}
            {farm.sample && <SampleTag />}
          </h3>
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

        <p className="text-sm font-semibold text-muted">Farming since {farm.farmingSince}</p>
      </div>
    </div>
  )
}

function HarvestTicker() {
  const reduceMotion = useReducedMotion()
  if (!todaysHarvest) return null

  const looped = [...todaysHarvest.items, ...todaysHarvest.items]

  return (
    <Reveal className="mt-12">
      <div className="relative overflow-hidden rounded-2xl border border-leaf/15 bg-surface py-4 shadow-soft">
        <div className="mb-2 flex items-center gap-3 px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-leaf">Today&rsquo;s harvest</p>
          <p className="font-heading text-sm italic text-secondary">picked at {todaysHarvest.pickedAt}</p>
          {todaysHarvest.sample && <SampleTag />}
        </div>
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
    </Reveal>
  )
}

function FarmStory() {
  if (liveFarms.length === 0) return null

  return (
    <Section
      id="farm-story"
      band="surface"
      align="left"
      eyebrow="Our farms"
      title="Know your farmer"
      intro="Every box traces back to a real farm we visit, not a warehouse."
    >
      <RevealGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {liveFarms.map((farm, index) => (
          <RevealItem key={farm.id} className="h-full">
            <FarmCard farm={farm} gradientClass={gradients[index % gradients.length]} />
          </RevealItem>
        ))}
      </RevealGroup>

      <HarvestTicker />
    </Section>
  )
}

export default FarmStory
