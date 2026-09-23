import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/Button'
import ProduceGlyph from '../components/ProduceGlyph'
import ProfileFields from '../components/ProfileFields'
import { monthlyPlan } from '../data/plans'
import { allProduce } from '../data/produce'
import { delivery } from '../data/site'
import { logOut, openAuthSheet, patchSubscription, saveSubscription, updateProfile, useAuth } from '../hooks/useAuth'
import { useComboBuilder } from '../hooks/useComboBuilder'
import { goTo } from '../hooks/useRoute'
import { cleanProfile, validateProfile } from '../utils/profile'
import { buildSubscriptionMessage, waLink } from '../utils/whatsapp'

const currency = new Intl.NumberFormat('en-IN')
const dateFormat = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
const produceById = new Map(allProduce.map((item) => [item.id, item]))

const card = 'rounded-2xl border border-leaf/15 bg-surface p-6 shadow-soft'

// The next delivery on `day` that can still be changed: picks lock at 12 pm
// the day before, so a delivery whose cutoff has passed is skipped.
function nextDelivery(day, now = new Date()) {
  const jsDay = (delivery.days.indexOf(day) + 1) % 7
  for (let offset = 0; offset <= 7; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    if (date.getDay() !== jsDay) continue
    const cutoff = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 12)
    if (now < cutoff) return { date, cutoff }
  }
  return null
}

function basketItems(basket) {
  return [...basket.vegetables, ...basket.leafyGreens].map((id) => produceById.get(id)).filter(Boolean)
}

function editInBuilder(combo, basket) {
  combo.loadBasket(basket)
  goTo('#combo-builder')
}

function CardTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-heading text-xl font-semibold text-soil">{children}</h2>
      {action}
    </div>
  )
}

function ItemList({ items }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-2 rounded-full bg-lime/15 px-3 py-1.5 text-sm text-soil">
          <ProduceGlyph item={item} className="text-base" iconClassName="h-5 w-5" />
          {item.name}
        </li>
      ))}
    </ul>
  )
}

function WhatsAppConfirm({ customer, subscription, items }) {
  const sent = subscription.whatsappSentAt
  const changedSinceSent = sent && subscription.updatedAt > sent

  if (sent && !changedSinceSent) {
    return (
      <p className="text-sm text-secondary">
        Sent to Freshley on WhatsApp.{' '}
        <a
          href={waLink(buildSubscriptionMessage(customer, subscription, items))}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => patchSubscription({ whatsappSentAt: new Date().toISOString() })}
          className="inline-flex min-h-11 items-center font-semibold text-leaf hover:underline"
        >
          Send again
        </a>
      </p>
    )
  }

  return (
    <div className="rounded-2xl border border-tomato/30 bg-tomato/5 p-4">
      <p className="text-sm font-semibold text-soil">
        {changedSinceSent ? 'You changed your subscription' : 'Last step: send it to us'}
      </p>
      <p className="mt-1 text-sm text-secondary">
        {changedSinceSent
          ? 'Send the update on WhatsApp so your next basket matches.'
          : 'Send your subscription on WhatsApp so we can schedule your first basket.'}
      </p>
      <Button
        href={waLink(buildSubscriptionMessage(customer, subscription, items))}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => patchSubscription({ whatsappSentAt: new Date().toISOString() })}
        size="sm"
        className="mt-3 w-full sm:w-auto"
      >
        Send on WhatsApp
      </Button>
    </div>
  )
}

function SubscriptionCard({ customer, subscription, combo }) {
  const items = basketItems(subscription)
  const paused = subscription.status === 'paused'
  const next = nextDelivery(subscription.deliveryDay)

  return (
    <div className={`${card} flex flex-col gap-6`}>
      <CardTitle
        action={
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              paused ? 'bg-soil/10 text-secondary' : 'bg-leaf/15 text-leaf'
            }`}
          >
            {paused ? 'Paused' : 'Active'}
          </span>
        }
      >
        {monthlyPlan.name}
      </CardTitle>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-secondary">Next basket</dt>
          <dd className="mt-1 font-heading text-lg font-semibold text-soil">
            {paused ? 'On hold' : next ? dateFormat.format(next.date) : '—'}
          </dd>
          {!paused && <dd className="text-sm text-secondary">{delivery.time}</dd>}
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-secondary">Change picks until</dt>
          <dd className="mt-1 font-heading text-lg font-semibold text-soil">
            {paused || !next ? '—' : `${dateFormat.format(next.cutoff)}, 12 pm`}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-secondary">Price</dt>
          <dd className="mt-1 font-heading text-lg font-semibold text-soil">
            ₹{currency.format(monthlyPlan.basePrice)}
            <span className="font-body text-sm font-normal text-muted"> / {monthlyPlan.duration}</span>
          </dd>
        </div>
      </dl>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">Delivery day</p>
        <div role="radiogroup" aria-label="Delivery day" className="flex flex-wrap gap-2">
          {delivery.days.map((day) => (
            <Button
              key={day}
              variant="toggle"
              size="sm"
              selected={subscription.deliveryDay === day}
              role="radio"
              aria-checked={subscription.deliveryDay === day}
              aria-label={day}
              onClick={() => patchSubscription({ deliveryDay: day, updatedAt: new Date().toISOString() })}
            >
              {day.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <CardTitle
          action={
            <Button variant="ghost" size="sm" onClick={() => editInBuilder(combo, subscription)}>
              Edit basket
            </Button>
          }
        >
          <span className="text-lg">This week&rsquo;s basket</span>
        </CardTitle>
        <p className="text-sm text-secondary">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
        <ItemList items={items} />
      </div>

      <WhatsAppConfirm customer={customer} subscription={subscription} items={items} />

      <div className="border-t border-leaf/15 pt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            patchSubscription({ status: paused ? 'active' : 'paused', updatedAt: new Date().toISOString() })
          }
        >
          {paused ? 'Resume deliveries' : 'Pause deliveries'}
        </Button>
        <p className="mt-2 text-sm text-secondary">
          {paused
            ? 'No baskets are delivered while paused.'
            : 'Travelling? Pause any time and resume when you’re back.'}
        </p>
      </div>
    </div>
  )
}

function NoSubscriptionCard({ combo }) {
  const draft = basketItems(combo.state)
  const hasDraft = combo.hasPicks && draft.length > 0

  return (
    <div className={`${card} flex flex-col gap-4`}>
      <CardTitle>{hasDraft ? 'Your saved basket' : 'No subscription yet'}</CardTitle>
      {hasDraft ? (
        <>
          <p className="text-sm text-secondary">
            {combo.state.deliveryDay
              ? `Every ${combo.state.deliveryDay}, ${delivery.time}. ₹${currency.format(monthlyPlan.basePrice)} / ${monthlyPlan.duration}.`
              : 'Choose a delivery day to subscribe.'}
          </p>
          <ItemList items={draft} />
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            {combo.isComplete && (
              <Button
                onClick={() =>
                  saveSubscription({
                    vegetables: combo.state.vegetables,
                    leafyGreens: combo.state.leafyGreens,
                    deliveryDay: combo.state.deliveryDay,
                  })
                }
              >
                Subscribe to this basket
              </Button>
            )}
            <Button variant="secondary" href="#combo-builder">
              Edit basket
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-secondary">
            Pick up to 8 vegetables and 5 leafy greens, choose your delivery day, and your first basket arrives the
            next morning, {delivery.time}.
          </p>
          <Button href="#combo-builder" className="self-start">
            Build your basket
          </Button>
        </>
      )}
    </div>
  )
}

function ProfileCard({ customer }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(customer)
  const [errors, setErrors] = useState({})
  const { address } = customer

  function handleSave(event) {
    event.preventDefault()
    const found = validateProfile(draft, { withMobile: false })
    setErrors(found)
    if (Object.keys(found).length > 0) {
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    updateProfile(cleanProfile(draft))
    setEditing(false)
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} noValidate className={`${card} flex flex-col gap-6`}>
        <CardTitle>Edit details</CardTitle>
        <p className="text-sm text-secondary">
          Mobile number: <span className="font-medium text-soil">+91 {customer.mobile}</span>
        </p>
        <ProfileFields idPrefix="profile" profile={draft} onChange={setDraft} errors={errors} showMobile={false} />
        <div className="flex gap-3">
          <Button type="submit" size="sm">
            Save
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setDraft(customer)
              setErrors({})
              setEditing(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className={`${card} flex flex-col gap-4`}>
      <CardTitle
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(customer)
              setEditing(true)
            }}
          >
            Edit
          </Button>
        }
      >
        Your details
      </CardTitle>
      <dl className="flex flex-col gap-3 text-sm">
        <div>
          <dt className="text-secondary">Name</dt>
          <dd className="font-medium text-soil">{customer.name}</dd>
        </div>
        <div>
          <dt className="text-secondary">Mobile</dt>
          <dd className="font-medium text-soil">+91 {customer.mobile}</dd>
        </div>
        <div>
          <dt className="text-secondary">Alternate number</dt>
          <dd className="font-medium text-soil">{customer.altMobile ? `+91 ${customer.altMobile}` : 'Not added'}</dd>
        </div>
        <div>
          <dt className="text-secondary">Delivery address</dt>
          <dd className="font-medium text-soil">
            {address.line1}, {address.line2}
            <br />
            {address.city} {address.pincode}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function Dashboard() {
  const { customer, subscription } = useAuth()
  const combo = useComboBuilder()
  const reduceMotion = useReducedMotion()

  const enter = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }

  if (!customer) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-soil">Your Freshley account</h1>
        <p className="mt-3 text-secondary">Log in to see your weekly basket and delivery day.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => openAuthSheet({ mode: 'login' })}>Log in</Button>
          <Button variant="secondary" onClick={() => openAuthSheet({ mode: 'signup' })}>
            Sign up
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-16 lg:pt-12">
      <motion.div {...enter} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">My account</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-soil sm:text-4xl">
            Namaste, {customer.name.split(' ')[0]}
          </h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            logOut()
            goTo('#top')
          }}
        >
          Log out
        </Button>
      </motion.div>

      <motion.div
        {...enter}
        transition={reduceMotion ? undefined : { ...enter.transition, delay: 0.08 }}
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start"
      >
        <div className="lg:col-span-2">
          {subscription ? (
            <SubscriptionCard customer={customer} subscription={subscription} combo={combo} />
          ) : (
            <NoSubscriptionCard combo={combo} />
          )}
        </div>
        <ProfileCard customer={customer} />
      </motion.div>
    </section>
  )
}

export default Dashboard
