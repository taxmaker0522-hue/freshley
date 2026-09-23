import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/Button'
import ProduceGlyph from '../components/ProduceGlyph'
import ProfileFields from '../components/ProfileFields'
import { ORDER_STATUS } from '../data/orders'
import { monthlyPlan } from '../data/plans'
import { delivery } from '../data/site'
import { logOut, openAuthSheet, patchSubscription, saveProfile, saveSubscription, useAuth } from '../hooks/useAuth'
import { useComboBuilder } from '../hooks/useComboBuilder'
import { useProducts } from '../hooks/useProducts'
import { goTo } from '../hooks/useRoute'
import { cutoffFor, formatDate, nextDelivery, toISODate } from '../utils/dates'
import { cleanProfile, validateProfile } from '../utils/profile'

const currency = new Intl.NumberFormat('en-IN')

const card = 'rounded-2xl border border-leaf/15 bg-surface p-6 shadow-soft'

function useBasketItems(basket) {
  const { byId } = useProducts()
  return [...basket.vegetables, ...basket.leafyGreens].map((id) => byId.get(id)).filter(Boolean)
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

function ErrorNote({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="text-sm text-error">
      {children}
    </p>
  )
}

// Runs an async account action with a busy flag and an error message.
function useAction() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  async function run(action) {
    setBusy(true)
    setError(null)
    const failed = await action()
    setBusy(false)
    if (failed) setError(failed)
  }
  return { busy, error, run }
}

function SubscriptionCard({ subscription, combo }) {
  const items = useBasketItems(subscription)
  const paused = subscription.status === 'paused'
  const next = nextDelivery(subscription.deliveryDay)
  const { busy, error, run } = useAction()

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
            {paused ? 'On hold' : next ? formatDate(next.date) : '—'}
          </dd>
          {!paused && <dd className="text-sm text-secondary">{delivery.time}</dd>}
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-secondary">Change picks until</dt>
          <dd className="mt-1 font-heading text-lg font-semibold text-soil">
            {paused || !next ? '—' : `${formatDate(next.cutoff)}, 12 pm`}
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
              disabled={busy}
              onClick={() => run(() => patchSubscription({ deliveryDay: day }))}
            >
              {day.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <CardTitle
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                combo.loadBasket(subscription)
                goTo('#combo-builder')
              }}
            >
              Edit basket
            </Button>
          }
        >
          <span className="text-lg">Your weekly basket</span>
        </CardTitle>
        <p className="text-sm text-secondary">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
        <ItemList items={items} />
      </div>

      <div className="border-t border-leaf/15 pt-4">
        <Button
          variant="secondary"
          size="sm"
          disabled={busy}
          onClick={() => run(() => patchSubscription({ status: paused ? 'active' : 'paused' }))}
        >
          {paused ? 'Resume deliveries' : 'Pause deliveries'}
        </Button>
        <p className="mt-2 text-sm text-secondary">
          {paused
            ? 'No baskets are delivered while paused.'
            : 'Travelling? Pause any time and resume when you’re back.'}
        </p>
        <ErrorNote>{error}</ErrorNote>
      </div>
    </div>
  )
}

function OrderRow({ order }) {
  const items = useBasketItems(order)
  const status = ORDER_STATUS[order.status]
  const editable = order.status === 'scheduled' && new Date() < cutoffFor(order.deliveryDate)

  return (
    <li className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading text-lg font-semibold text-soil">{formatDate(order.deliveryDate)}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
      </div>
      <p className="text-sm text-secondary">{items.map((item) => item.name).join(', ')}</p>
      {editable && (
        <p className="text-sm text-muted">You can change this basket until {formatDate(cutoffFor(order.deliveryDate))}, 12 pm.</p>
      )}
    </li>
  )
}

function OrdersCard({ orders }) {
  const today = toISODate(new Date())
  const upcoming = orders.filter((order) => order.deliveryDate >= today).reverse()
  const past = orders.filter((order) => order.deliveryDate < today)

  return (
    <div className={`${card} flex flex-col gap-2`}>
      <CardTitle>My orders</CardTitle>
      {orders.length === 0 ? (
        <p className="mt-2 text-sm text-secondary">Your weekly baskets will be listed here once you subscribe.</p>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-secondary">Upcoming</p>
              <ul className="divide-y divide-leaf/10">
                {upcoming.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </ul>
            </>
          )}
          {past.length > 0 && (
            <>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-secondary">Past baskets</p>
              <ul className="divide-y divide-leaf/10">
                {past.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}

function NoSubscriptionCard({ combo }) {
  const draft = combo.selectedItems
  const hasDraft = combo.hasPicks && draft.length > 0
  const { busy, error, run } = useAction()

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
              <Button disabled={busy} onClick={() => run(() => saveSubscription(combo.basket))}>
                {busy ? 'Saving…' : 'Subscribe to this basket'}
              </Button>
            )}
            <Button variant="secondary" href="#combo-builder">
              Edit basket
            </Button>
          </div>
          <ErrorNote>{error}</ErrorNote>
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
  const { busy, error, run } = useAction()
  const { address } = customer

  function handleSave(event) {
    event.preventDefault()
    const form = event.currentTarget
    const found = validateProfile(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      form.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    run(async () => {
      const failed = await saveProfile(cleanProfile(draft))
      if (!failed) setEditing(false)
      return failed
    })
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} noValidate className={`${card} flex flex-col gap-6`}>
        <CardTitle>Edit details</CardTitle>
        <ProfileFields idPrefix="profile" profile={draft} onChange={setDraft} errors={errors} />
        <ErrorNote>{error}</ErrorNote>
        <div className="flex gap-3">
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
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

function Prompt({ title, text, children }) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
      <h1 className="font-heading text-3xl font-semibold text-soil">{title}</h1>
      <p className="mt-3 text-secondary">{text}</p>
      {children && <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">{children}</div>}
    </section>
  )
}

function Dashboard() {
  const { status, customer, subscription, orders, isAdmin } = useAuth()
  const combo = useComboBuilder()
  const reduceMotion = useReducedMotion()

  if (status === 'loading') return <Prompt title="Your Freshley account" text="Loading your account…" />

  if (status === 'signedOut' || status === 'unconfigured') {
    return (
      <Prompt title="Your Freshley account" text="Sign in to see your weekly basket, delivery day and orders.">
        <Button onClick={() => openAuthSheet({ intent: 'account' })}>Sign in</Button>
      </Prompt>
    )
  }

  if (status === 'needsProfile') {
    return (
      <Prompt title="Add your delivery details" text="We need your mobile number and address before your first basket.">
        <Button onClick={() => openAuthSheet({ intent: 'account' })}>Add details</Button>
      </Prompt>
    )
  }

  const enter = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-16 lg:pt-12">
      <motion.div {...enter} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">My account</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-soil sm:text-4xl">
            Namaste, {customer.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button variant="ghost" size="sm" href="#/admin">
              Admin
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await logOut()
              goTo('#top')
            }}
          >
            Log out
          </Button>
        </div>
      </motion.div>

      <motion.div
        {...enter}
        transition={reduceMotion ? undefined : { ...enter.transition, delay: 0.08 }}
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start"
      >
        <div className="flex flex-col gap-6 lg:col-span-2">
          {subscription ? (
            <SubscriptionCard subscription={subscription} combo={combo} />
          ) : (
            <NoSubscriptionCard combo={combo} />
          )}
          <OrdersCard orders={orders} />
        </div>
        <ProfileCard customer={customer} />
      </motion.div>
    </section>
  )
}

export default Dashboard
