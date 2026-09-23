import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/Button'
import { Field } from '../components/ProfileFields'
import { ORDER_STATUS } from '../data/orders'
import { vegetableCategories } from '../data/produce'
import { openAuthSheet, orderFromRow, subscriptionFromRow, useAuth } from '../hooks/useAuth'
import { saveProduct, useProducts } from '../hooks/useProducts'
import { supabase } from '../lib/supabase'
import { addDays, formatDate, toISODate } from '../utils/dates'
import { inputClass } from '../utils/profile'

// Staff page at #/admin. Every query here is also guarded by Row Level
// Security (is_admin() in supabase/schema.sql), so hiding the page is not
// what keeps customer data safe.

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'customers', label: 'Customers' },
]

const card = 'rounded-2xl border border-leaf/15 bg-surface p-4 shadow-soft sm:p-6'
const selectClass = `${inputClass} border-leaf/25`

function StatusBadge({ status }) {
  const { label, className } = ORDER_STATUS[status]
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-lime/10 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold text-soil">{value}</p>
    </div>
  )
}

// ---------------------------------------------------------------- orders

function OrdersTab() {
  const [date, setDate] = useState(() => addDays(toISODate(new Date()), 1))
  // Orders are stored with the date they were loaded for; a different date
  // means "still loading".
  const [loaded, setLoaded] = useState({ date: null, list: [] })
  const [error, setError] = useState(null)
  const { byId } = useProducts()
  const orders = loaded.date === date ? loaded.list : null

  useEffect(() => {
    let current = true
    supabase
      .from('orders')
      .select('*')
      .eq('delivery_date', date)
      .order('pincode')
      .order('name')
      .then(({ data, error: failed }) => {
        if (!current) return
        setError(failed ? 'Could not load orders.' : null)
        setLoaded({ date, list: (data ?? []).map(orderFromRow) })
      })
    return () => {
      current = false
    }
  }, [date])

  async function setStatus(order, status) {
    const { error: failed } = await supabase.from('orders').update({ status }).eq('id', order.id)
    if (failed) setError('Could not update that order.')
    else
      setLoaded((prev) => ({ ...prev, list: prev.list.map((o) => (o.id === order.id ? { ...o, status } : o)) }))
  }

  // How many of each item to pack for this day (skipped baskets excluded).
  const packTotals = useMemo(() => {
    const counts = new Map()
    for (const order of orders ?? []) {
      if (order.status === 'skipped') continue
      for (const id of [...order.vegetables, ...order.leafyGreens]) counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    return [...counts].sort((a, b) => b[1] - a[1])
  }, [orders])

  const countBy = (status) => (orders ?? []).filter((o) => o.status === status).length
  const nameOf = (id) => byId.get(id)?.name ?? id

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <Button variant="ghost" size="sm" aria-label="Previous day" onClick={() => setDate((d) => addDays(d, -1))}>
          ←
        </Button>
        <label className="flex flex-col gap-1 text-sm font-medium text-soil">
          Delivery date
          <input
            type="date"
            value={date}
            onChange={(event) => event.target.value && setDate(event.target.value)}
            className={`${selectClass} min-w-44`}
          />
        </label>
        <Button variant="ghost" size="sm" aria-label="Next day" onClick={() => setDate((d) => addDays(d, 1))}>
          →
        </Button>
        <p className="pb-3 text-sm text-secondary">{formatDate(date)}</p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      {orders === null ? (
        <p className="text-sm text-secondary">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className={`${card} text-sm text-secondary`}>No baskets for {formatDate(date)}.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Baskets" value={orders.length} />
            <Stat label="To pack" value={countBy('scheduled')} />
            <Stat label="Packed" value={countBy('packed')} />
            <Stat label="Delivered" value={countBy('delivered')} />
          </div>

          <div className={card}>
            <h3 className="font-heading text-lg font-semibold text-soil">Packing totals</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {packTotals.map(([id, count]) => (
                <li key={id} className="rounded-full bg-lime/15 px-3 py-1.5 text-sm text-soil">
                  {byId.get(id)?.emoji} {nameOf(id)} <span className="font-semibold">× {count}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {orders.map((order) => (
              <li key={order.id} className={`${card} flex flex-col gap-3`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg font-semibold text-soil">{order.name}</p>
                    <p className="text-sm text-secondary">
                      <a href={`tel:+91${order.mobile}`} className="inline-flex min-h-11 items-center font-medium text-leaf">
                        +91 {order.mobile}
                      </a>
                      {order.altMobile && (
                        <>
                          {' · alt '}
                          <a href={`tel:+91${order.altMobile}`} className="inline-flex min-h-11 items-center font-medium text-leaf">
                            {order.altMobile}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-soil">
                  {order.address} <span className="font-semibold">{order.pincode}</span>
                </p>
                <p className="text-sm text-secondary">
                  {[...order.vegetables, ...order.leafyGreens].map(nameOf).join(', ')}
                </p>
                <label className="flex flex-col gap-1 text-sm font-medium text-soil">
                  Status
                  <select
                    value={order.status}
                    onChange={(event) => setStatus(order, event.target.value)}
                    className={selectClass}
                  >
                    {Object.entries(ORDER_STATUS).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- products

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function ProductForm({ product, isNew, onDone }) {
  const [draft, setDraft] = useState(product)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const { byId } = useProducts()

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }))
  const setRegional = (key, value) => setDraft((d) => ({ ...d, regionalName: { ...d.regionalName, [key]: value } }))

  async function handleSubmit(event) {
    event.preventDefault()
    const name = draft.name.trim()
    if (name.length < 2) return setError('Enter a product name.')
    if (!draft.emoji.trim()) return setError('Add an emoji, e.g. 🥕')
    const id = isNew ? slugify(name) : draft.id
    if (isNew && byId.has(id)) return setError(`A product called “${name}” already exists.`)
    setBusy(true)
    const failed = await saveProduct({ ...draft, id, name, emoji: draft.emoji.trim(), sort: Number(draft.sort) || 0 })
    setBusy(false)
    if (failed) setError('Could not save. Check you are signed in as an admin.')
    else onDone()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl bg-lime/10 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id={`${draft.id || 'new'}-name`} label="Name">
          <input id={`${draft.id || 'new'}-name`} value={draft.name} onChange={(e) => set('name', e.target.value)} className={selectClass} />
        </Field>
        <Field id={`${draft.id || 'new'}-emoji`} label="Emoji">
          <input id={`${draft.id || 'new'}-emoji`} value={draft.emoji} onChange={(e) => set('emoji', e.target.value)} className={selectClass} />
        </Field>
        <Field id={`${draft.id || 'new'}-te`} label="Telugu name">
          <input id={`${draft.id || 'new'}-te`} value={draft.regionalName.te} onChange={(e) => setRegional('te', e.target.value)} className={selectClass} />
        </Field>
        <Field id={`${draft.id || 'new'}-hi`} label="Hindi name">
          <input id={`${draft.id || 'new'}-hi`} value={draft.regionalName.hi} onChange={(e) => setRegional('hi', e.target.value)} className={selectClass} />
        </Field>
        <Field id={`${draft.id || 'new'}-kind`} label="Type">
          <select id={`${draft.id || 'new'}-kind`} value={draft.kind} onChange={(e) => set('kind', e.target.value)} className={selectClass} disabled={!isNew}>
            <option value="vegetable">Vegetable</option>
            <option value="leafy">Leafy green / herb</option>
          </select>
        </Field>
        {draft.kind === 'vegetable' && (
          <Field id={`${draft.id || 'new'}-category`} label="Group">
            <select id={`${draft.id || 'new'}-category`} value={draft.category ?? ''} onChange={(e) => set('category', e.target.value)} className={selectClass}>
              {vegetableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field id={`${draft.id || 'new'}-sort`} label="Order in list" hint="lower shows first">
          <input id={`${draft.id || 'new'}-sort`} type="number" inputMode="numeric" value={draft.sort} onChange={(e) => set('sort', e.target.value)} className={selectClass} />
        </Field>
      </div>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={busy}>
          {busy ? 'Saving…' : isNew ? 'Add product' : 'Save'}
        </Button>
        <Button variant="secondary" size="sm" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-secondary">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-leaf" />
      {label}
    </label>
  )
}

function ProductsTab() {
  const { all } = useProducts()
  const [kind, setKind] = useState('vegetable')
  const [editing, setEditing] = useState(null) // product id, or 'new'
  const [error, setError] = useState(null)

  const list = all.filter((item) => item.kind === kind)
  const categoryLabel = (id) => vegetableCategories.find((cat) => cat.id === id)?.label ?? ''
  const blank = {
    id: '',
    kind,
    category: vegetableCategories[0].id,
    name: '',
    regionalName: { te: '', hi: '' },
    emoji: '',
    seasonal: false,
    available: true,
    sort: (list.at(-1)?.sort ?? 0) + 10,
  }

  async function quickSave(product, patch) {
    setError(null)
    const failed = await saveProduct({ ...product, ...patch })
    if (failed) setError('Could not save. Check you are signed in as an admin.')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="toggle" size="sm" selected={kind === 'vegetable'} onClick={() => setKind('vegetable')}>
            Vegetables
          </Button>
          <Button variant="toggle" size="sm" selected={kind === 'leafy'} onClick={() => setKind('leafy')}>
            Leafy greens
          </Button>
        </div>
        {editing !== 'new' && (
          <Button size="sm" onClick={() => setEditing('new')}>
            + Add product
          </Button>
        )}
      </div>
      <p className="text-sm text-secondary">
        Untick <span className="font-semibold text-soil">Available</span> to hide a product from the basket builder this
        week. It drops out of saved baskets that haven&rsquo;t been subscribed yet.
      </p>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      {editing === 'new' && <ProductForm key={kind} product={blank} isNew onDone={() => setEditing(null)} />}

      <ul className="divide-y divide-leaf/10 rounded-2xl border border-leaf/15 bg-surface px-4 shadow-soft sm:px-6">
        {list.map((product) => (
          <li key={product.id} className="py-3">
            {editing === product.id ? (
              <ProductForm product={product} onDone={() => setEditing(null)} />
            ) : (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-emoji text-2xl" aria-hidden="true">
                  {product.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`font-medium ${product.available ? 'text-soil' : 'text-muted line-through'}`}>{product.name}</p>
                  <p className="truncate text-sm text-muted">
                    {[product.regionalName.te, product.regionalName.hi, categoryLabel(product.category)].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Toggle label="Available" checked={product.available} onChange={(v) => quickSave(product, { available: v })} />
                  <Toggle label="Seasonal" checked={product.seasonal} onChange={(v) => quickSave(product, { seasonal: v })} />
                  <Button variant="ghost" size="sm" onClick={() => setEditing(product.id)}>
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------- customers

function CustomersTab() {
  const [customers, setCustomers] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*, subscriptions(*)')
      .order('created_at', { ascending: false })
      .then(({ data, error: failed }) => {
        setError(failed ? 'Could not load customers.' : null)
        setCustomers(
          (data ?? []).map((row) => {
            const sub = Array.isArray(row.subscriptions) ? row.subscriptions[0] : row.subscriptions
            return { ...row, subscription: sub ? subscriptionFromRow(sub) : null }
          }),
        )
      })
  }, [])

  if (error) return <p role="alert" className="text-sm text-error">{error}</p>
  if (!customers) return <p className="text-sm text-secondary">Loading customers…</p>

  const count = (status) => customers.filter((c) => c.subscription?.status === status).length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Customers" value={customers.length} />
        <Stat label="Active" value={count('active')} />
        <Stat label="Paused" value={count('paused')} />
      </div>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {customers.map((c) => (
          <li key={c.id} className={`${card} flex flex-col gap-2`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-lg font-semibold text-soil">{c.name}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  c.subscription?.status === 'active'
                    ? 'bg-leaf/15 text-leaf'
                    : 'bg-soil/10 text-secondary'
                }`}
              >
                {c.subscription ? (c.subscription.status === 'active' ? 'Active' : 'Paused') : 'Not subscribed'}
              </span>
            </div>
            <p className="text-sm">
              <a href={`tel:+91${c.mobile}`} className="inline-flex min-h-11 items-center font-medium text-leaf">
                +91 {c.mobile}
              </a>
              {c.alt_mobile && <span className="text-secondary"> · alt {c.alt_mobile}</span>}
            </p>
            <p className="text-sm text-soil">
              {c.address_line1}, {c.address_line2}, {c.city} <span className="font-semibold">{c.pincode}</span>
            </p>
            {c.subscription && (
              <p className="text-sm text-secondary">
                Every {c.subscription.deliveryDay} ·{' '}
                {c.subscription.vegetables.length + c.subscription.leafyGreens.length} items
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------- page

function Prompt({ title, text, children }) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
      <h1 className="font-heading text-3xl font-semibold text-soil">{title}</h1>
      <p className="mt-3 text-secondary">{text}</p>
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </section>
  )
}

function Admin() {
  const { status, isAdmin } = useAuth()
  const [tab, setTab] = useState('orders')
  const reduceMotion = useReducedMotion()

  if (status === 'loading') return <Prompt title="Freshley admin" text="Checking your access…" />
  if (status === 'signedOut' || status === 'unconfigured') {
    return (
      <Prompt title="Freshley admin" text="Sign in with your staff Google account.">
        <Button onClick={() => openAuthSheet({ intent: 'admin' })}>Sign in</Button>
      </Prompt>
    )
  }
  if (!isAdmin) {
    return <Prompt title="Staff only" text="This page is for the Freshley team. Your account doesn’t have admin access." />
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-16 lg:pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Staff</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-soil sm:text-4xl">Freshley admin</h1>

      <div role="tablist" aria-label="Admin sections" className="mt-6 flex max-w-md gap-1 rounded-full bg-lime/10 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="relative min-h-11 flex-1 rounded-full px-2 text-sm font-semibold"
          >
            {tab === t.id && (
              <motion.span
                layoutId="admin-tab-bg"
                className="absolute inset-0 rounded-full bg-leaf"
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${tab === t.id ? 'text-cream' : 'text-secondary'}`}>{t.label}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-8">
        {tab === 'orders' && <OrdersTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'customers' && <CustomersTab />}
      </div>
    </section>
  )
}

export default Admin
