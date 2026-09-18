import { useEffect, useState } from 'react'
import { useReducedMotion, useSpring } from 'motion/react'
import Button from '../components/Button'
import { householdSizes, plans } from '../data/plans'

const currency = new Intl.NumberFormat('en-IN')

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12l5 5 9-9" />
    </svg>
  )
}

function priceFor(plan, multiplier) {
  return Math.round((plan.basePrice * multiplier) / 10) * 10
}

function originalPriceFor(plan, multiplier) {
  if (!plan.discountPercent) return null
  const discounted = priceFor(plan, multiplier)
  return Math.round(discounted / (1 - plan.discountPercent / 100) / 10) * 10
}

function AnimatedPrice({ value }) {
  const reduceMotion = useReducedMotion()
  const spring = useSpring(value, { stiffness: 120, damping: 22, mass: 0.6 })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!reduceMotion) spring.set(value)
  }, [value, spring, reduceMotion])

  useEffect(() => {
    if (reduceMotion) return undefined
    return spring.on('change', (v) => setDisplay(Math.round(v)))
  }, [spring, reduceMotion])

  return <>₹{currency.format(reduceMotion ? value : display)}</>
}

function FeatureRow({ label, included }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          included ? 'bg-leaf/15 text-leaf' : 'bg-soil/5 text-muted'
        }`}
      >
        {included ? <CheckIcon className="h-3 w-3" /> : <span className="block h-0.5 w-2.5 rounded-full bg-current" />}
      </span>
      <span className={included ? 'text-secondary' : 'text-muted'}>{label}</span>
    </li>
  )
}

function PlanCard({ plan, multiplier }) {
  const price = priceFor(plan, multiplier)
  const original = originalPriceFor(plan, multiplier)

  return (
    <div
      className={`relative flex flex-col gap-6 rounded-2xl border bg-surface p-6 transition-[transform,box-shadow] duration-200 lg:p-8 ${
        plan.highlighted
          ? 'border-leaf shadow-lift lg:-translate-y-3'
          : 'border-leaf/15 shadow-soft hover:-translate-y-1 hover:shadow-lift'
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-leaf px-4 py-1 text-xs font-bold uppercase tracking-wide text-cream shadow-soft">
          Most popular
        </span>
      )}

      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-xl font-semibold text-soil">{plan.name}</h3>
          {plan.discountPercent > 0 && (
            <span className="rounded-full bg-lime/25 px-2.5 py-1 text-xs font-semibold text-leaf">
              Save {plan.discountPercent}%
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-secondary">{plan.description}</p>
      </div>

      <div>
        <p className="font-heading text-4xl font-semibold text-soil">
          <AnimatedPrice value={price} />
        </p>
        <p className="mt-1 text-sm text-muted">
          for {plan.duration}
          {original && (
            <>
              {' · '}
              <span className="line-through">₹{currency.format(original)}</span>
            </>
          )}
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {plan.features.map((feature) => (
          <FeatureRow key={feature.label} label={feature.label} included={feature.included} />
        ))}
      </ul>

      <Button
        href="#combo-builder"
        variant={plan.highlighted ? 'primary' : 'secondary'}
        className="mt-auto w-full"
      >
        Choose {plan.name}
      </Button>
    </div>
  )
}

function Plans() {
  const [sizeId, setSizeId] = useState('small')
  const activeSize = householdSizes.find((size) => size.id === sizeId) ?? householdSizes[0]

  return (
    <section id="plans" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-16 lg:py-24">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-soil sm:text-4xl">
          Simple plans, honest prices
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-secondary">
          No lock-ins, no fine print. Pick a plan, build your box, pause whenever life happens.
        </p>
      </div>

      <div role="radiogroup" aria-label="Household size" className="mt-8 flex flex-wrap justify-center gap-2">
        {householdSizes.map((size) => (
          <Button
            key={size.id}
            variant="toggle"
            size="sm"
            selected={sizeId === size.id}
            role="radio"
            aria-checked={sizeId === size.id}
            onClick={() => setSizeId(size.id)}
          >
            {size.label}
          </Button>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start md:gap-6 lg:gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} multiplier={activeSize.multiplier} />
        ))}
      </div>
    </section>
  )
}

export default Plans
