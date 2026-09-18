import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/Button'
import ProduceCard from '../components/ProduceCard'
import ProduceGlyph from '../components/ProduceGlyph'
import { Reveal } from '../components/Reveal'
import Section from '../components/Section'
import { plans } from '../data/plans'
import { vegetables, leafyGreens, fruits } from '../data/produce'
import { presets } from '../data/presets'
import { buildBoxMessage, waLink } from '../utils/whatsapp'
import { DELIVERY_SLOTS, FREQUENCIES, LIMITS, useComboBuilder } from '../hooks/useComboBuilder'

const TABS = [
  { id: 'vegetables', label: 'Vegetables', shortLabel: 'Veg', data: vegetables },
  { id: 'leafyGreens', label: 'Leafy greens & herbs', shortLabel: 'Greens', data: leafyGreens },
  { id: 'fruits', label: 'Fruits', shortLabel: 'Fruit', data: fruits },
]

const currency = new Intl.NumberFormat('en-IN')

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="toggle"
            size="sm"
            selected={value === option.id}
            role="radio"
            aria-checked={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function SummaryContent({ combo }) {
  const { selectedItems, pricePerDay, monthlyTotal, frequency, state, toggleItem, setFrequency, setDeliverySlot, isComplete } =
    combo

  const chosenPlan = plans.find((plan) => plan.id === state.planId)

  const categoryOf = (id) => {
    if (state.vegetables.includes(id)) return 'vegetables'
    if (state.leafyGreens.includes(id)) return 'leafyGreens'
    return 'fruits'
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-soil">Your box</h3>
        {selectedItems.length === 0 ? (
          <p className="mt-2 text-sm text-secondary">Nothing picked yet — choose from the tabs.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1.5">
            {selectedItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-lime/10 px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2 text-soil">
                  <ProduceGlyph item={item} className="text-base" iconClassName="h-5 w-5" />
                  {item.name}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-secondary">₹{item.pricePerDay}</span>
                  <button
                    type="button"
                    onClick={() => toggleItem(categoryOf(item.id), item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-error/10 hover:text-error"
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <OptionGroup label="Frequency" options={FREQUENCIES} value={state.frequency} onChange={setFrequency} />
      <OptionGroup label="Delivery slot" options={DELIVERY_SLOTS} value={state.deliverySlot} onChange={setDeliverySlot} />

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-center justify-between gap-2">
          <span className="text-secondary">Plan</span>
          {chosenPlan ? (
            <span className="font-medium text-soil">
              {chosenPlan.name} ·{' '}
              <a href="#plans" className="font-semibold text-leaf hover:underline">
                change
              </a>
            </span>
          ) : (
            <a href="#plans" className="font-semibold text-leaf hover:underline">
              Choose a plan
            </a>
          )}
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-secondary">Pincode</span>
          {state.pincode ? (
            <span className="font-medium text-soil">{state.pincode} ✓</span>
          ) : (
            <a href="#delivery-check" className="font-semibold text-leaf hover:underline">
              Check delivery
            </a>
          )}
        </li>
      </ul>

      <div className="border-t border-leaf/15 pt-4">
        <div className="flex items-center justify-between text-sm text-secondary">
          <span>Per day</span>
          <span>₹{pricePerDay}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-base font-semibold text-soil">
          <span>Est. monthly ({frequency.label.toLowerCase()})</span>
          <span>₹{currency.format(monthlyTotal)}</span>
        </div>
      </div>

      <div>
        <Button
          href={isComplete ? waLink(buildBoxMessage(combo)) : undefined}
          target={isComplete ? '_blank' : undefined}
          rel="noreferrer noopener"
          aria-disabled={!isComplete}
          className="w-full"
        >
          Subscribe to this box
        </Button>
        <p className="mt-2 text-center text-sm text-secondary">
          {isComplete
            ? 'Opens WhatsApp with your box details filled in.'
            : 'Pick 3 vegetables and 2 leafy greens to continue.'}
        </p>
      </div>
    </div>
  )
}

function ComboBuilder() {
  const combo = useComboBuilder()
  const [activeTab, setActiveTab] = useState('vegetables')
  const reduceMotion = useReducedMotion()

  const currentTab = TABS.find((tab) => tab.id === activeTab)
  const currentCount = combo.state[activeTab].length
  const currentLimit = LIMITS[activeTab]
  const limitReached = currentCount >= currentLimit.max

  return (
    <Section
      id="combo-builder"
      align="left"
      eyebrow="Build your box"
      title="Build your daily box"
      intro="Pick 3 vegetables, 2 leafy greens or herbs, and up to 2 fruits — or start from a preset."
    >
      <Reveal className="mt-6 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button key={preset.id} variant="ghost" size="sm" onClick={() => combo.applyPreset(preset)}>
            {preset.label}
          </Button>
        ))}
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start lg:gap-10">
        <div className="lg:col-span-2">
          <div className="relative flex gap-1 rounded-full bg-lime/10 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="relative min-h-11 flex-1 rounded-full px-2 py-2.5 text-sm font-semibold"
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="combo-tab-bg"
                    className="absolute inset-0 rounded-full bg-leaf"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeTab === tab.id ? 'text-cream' : 'text-secondary'}`}>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="text-sm font-medium text-secondary">
              {currentCount} of {currentLimit.max} selected
              {currentLimit.min === 0 && ' · optional'}
            </p>
            {limitReached && (
              <p className="text-sm text-secondary">Deselect one to swap.</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {currentTab.data.map((item) => {
              const selected = combo.state[activeTab].includes(item.id)
              return (
                <ProduceCard
                  key={item.id}
                  item={item}
                  selected={selected}
                  disabled={!selected && limitReached}
                  shake={combo.blockedId === item.id}
                  onToggle={(id) => combo.toggleItem(activeTab, id)}
                />
              )
            })}
          </div>
        </div>

        <aside
          data-combo-summary
          className="hidden lg:col-span-1 lg:block lg:sticky lg:top-24 lg:self-start"
        >
          <div className="rounded-2xl border border-leaf/15 bg-surface p-6 shadow-lift">
            <SummaryContent combo={combo} />
          </div>
        </aside>

        <div
          id="combo-summary"
          data-combo-summary
          className="scroll-mt-24 rounded-2xl border border-leaf/15 bg-surface p-6 shadow-lift lg:hidden"
        >
          <SummaryContent combo={combo} />
        </div>
      </div>
    </Section>
  )
}

export default ComboBuilder
