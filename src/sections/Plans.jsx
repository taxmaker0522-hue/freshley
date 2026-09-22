import Button from '../components/Button'
import { Reveal } from '../components/Reveal'
import Section from '../components/Section'
import { monthlyPlan } from '../data/plans'

const currency = new Intl.NumberFormat('en-IN')

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12l5 5 9-9" />
    </svg>
  )
}

function Plans() {
  return (
    <Section
      id="plans"
      band="lime"
      eyebrow="Plan"
      title="One simple plan, honest price"
      intro="No lock-ins, no fine print. Subscribe monthly, then choose what goes in your basket each week."
    >
      <Reveal className="mx-auto mt-12 max-w-md">
        <div className="flex flex-col gap-6 rounded-2xl border border-leaf bg-surface p-6 shadow-lift lg:p-8">
          <div>
            <h3 className="font-heading text-xl font-semibold text-soil">{monthlyPlan.name}</h3>
            <p className="mt-1 text-sm text-secondary">{monthlyPlan.description}</p>
          </div>

          <p className="font-heading text-4xl font-semibold text-soil">
            ₹{currency.format(monthlyPlan.basePrice)}
            <span className="text-base font-normal text-muted"> / {monthlyPlan.duration}</span>
          </p>

          <ul className="flex flex-col gap-2.5">
            {monthlyPlan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-secondary">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <Button href="#combo-builder" className="w-full">
            Build your basket
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}

export default Plans
