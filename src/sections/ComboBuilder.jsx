import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/Button'
import ProduceCard from '../components/ProduceCard'
import ProduceGlyph from '../components/ProduceGlyph'
import { Reveal } from '../components/Reveal'
import Section from '../components/Section'
import { monthlyPlan } from '../data/plans'
import { vegetableCategories } from '../data/produce'
import { useProducts } from '../hooks/useProducts'
import { presets } from '../data/presets'
import { cutoffDayFor, delivery } from '../data/site'
import { buildBoxMessage, waLink } from '../utils/whatsapp'
import { LIMITS, useComboBuilder } from '../hooks/useComboBuilder'
import { openAuthSheet, saveSubscription, useAuth } from '../hooks/useAuth'
import { DASHBOARD_HASH, goTo } from '../hooks/useRoute'

const TABS = [
  { id: 'vegetables', label: 'Vegetables', shortLabel: 'Veg' },
  { id: 'leafyGreens', label: 'Leafy greens & herbs', shortLabel: 'Greens' },
]

const currency = new Intl.NumberFormat('en-IN')

function SummaryContent({ combo }) {
  const { selectedItems, state, toggleItem, setDeliveryDay, isComplete } = combo
  const { customer, subscription } = useAuth()

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  async function subscribe() {
    if (!isComplete) return
    if (!customer) {
      openAuthSheet({ intent: 'subscribe' })
      return
    }
    setSaving(true)
    setSaveError(null)
    const failed = await saveSubscription(combo.basket)
    setSaving(false)
    if (failed) {
      setSaveError(failed)
      return
    }
    goTo(DASHBOARD_HASH)
    window.scrollTo({ top: 0 })
  }

  const categoryOf = (id) => (state.vegetables.includes(id) ? 'vegetables' : 'leafyGreens')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-soil">Your basket</h3>
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
                <button
                  type="button"
                  onClick={() => toggleItem(categoryOf(item.id), item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="-my-2 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-error/10 hover:text-error"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">Delivery day</p>
        <div role="radiogroup" aria-label="Delivery day" className="flex flex-wrap gap-2">
          {delivery.days.map((day) => (
            <Button
              key={day}
              variant="toggle"
              size="sm"
              selected={state.deliveryDay === day}
              role="radio"
              aria-checked={state.deliveryDay === day}
              aria-label={day}
              onClick={() => setDeliveryDay(day)}
            >
              {day.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-center justify-between gap-2">
          <span className="text-secondary">Delivery</span>
          <span className="text-right font-medium text-soil">
            {state.deliveryDay ? `Every ${state.deliveryDay}, ${delivery.time}` : 'Choose a day above'}
          </span>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-secondary">Change picks until</span>
          <span className="text-right font-medium text-soil">
            {state.deliveryDay ? `${cutoffDayFor(state.deliveryDay)} 12 pm` : delivery.cutoff}
          </span>
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
        <div className="flex items-center justify-between text-base font-semibold text-soil">
          <span>{monthlyPlan.name}</span>
          <span>
            ₹{currency.format(monthlyPlan.basePrice)}/{monthlyPlan.duration}
          </span>
        </div>
        <p className="mt-1 text-sm text-secondary">One price. Your picks can change every week.</p>
      </div>

      <div>
        <Button onClick={subscribe} disabled={!isComplete || saving} className="w-full">
          {saving ? 'Saving…' : subscription ? 'Update my subscription' : 'Subscribe to this basket'}
        </Button>
        {saveError && (
          <p role="alert" className="mt-2 text-center text-sm text-error">
            {saveError}
          </p>
        )}
        <p className="mt-2 text-center text-sm text-secondary">
          {!isComplete
            ? 'Pick at least 1 vegetable and a delivery day to continue.'
            : customer
              ? 'Saves this basket to your account.'
              : 'Your picks stay saved while you sign in.'}
        </p>
        {isComplete && (
          <p className="mt-1 text-center text-sm">
            <a
              href={waLink(buildBoxMessage(combo))}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center font-semibold text-leaf hover:underline"
            >
              Or send this basket on WhatsApp
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

function ComboBuilder() {
  const combo = useComboBuilder()
  const [activeTab, setActiveTab] = useState('vegetables')
  const [category, setCategory] = useState(vegetableCategories[0].id)
  const reduceMotion = useReducedMotion()

  const products = useProducts()
  const tabItems = products[activeTab]
  const visibleItems =
    activeTab === 'vegetables' ? tabItems.filter((item) => item.category === category) : tabItems
  const pickedIn = (id) => products.vegetables.filter((v) => v.category === id && combo.state.vegetables.includes(v.id)).length
  const currentCount = combo.state[activeTab].length
  const currentLimit = LIMITS[activeTab]
  const limitReached = currentCount >= currentLimit.max

  return (
    <Section
      id="combo-builder"
      align="left"
      eyebrow="Build your basket"
      title="Build your weekly basket"
      intro={`Pick up to ${LIMITS.vegetables.max} vegetables and ${LIMITS.leafyGreens.max} leafy greens or herbs — or start from a preset. Choose your delivery day and order by ${delivery.cutoff} — it arrives next morning, ${delivery.time}, and repeats weekly.`}
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

          {activeTab === 'vegetables' && (
            <div
              role="radiogroup"
              aria-label="Vegetable group"
              className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {vegetableCategories.map((cat) => {
                const count = pickedIn(cat.id)
                return (
                  <Button
                    key={cat.id}
                    variant="toggle"
                    size="sm"
                    selected={category === cat.id}
                    role="radio"
                    aria-checked={category === cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="shrink-0"
                  >
                    {cat.label}
                    {count > 0 && ` · ${count}`}
                  </Button>
                )
              })}
            </div>
          )}

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
            {visibleItems.map((item) => {
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
