import { delivery } from '../data/site'

// Delivery dates are plain 'YYYY-MM-DD' strings (India dates), as stored in the
// orders table. These helpers keep the app's maths in line with
// next_delivery_date() / order_cutoff() in supabase/schema.sql.

const shortDate = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

export function toISODate(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(dateOrIso) {
  return shortDate.format(typeof dateOrIso === 'string' ? fromISODate(dateOrIso) : dateOrIso)
}

// 12 pm the day before the delivery.
export function cutoffFor(dateOrIso) {
  const date = typeof dateOrIso === 'string' ? fromISODate(dateOrIso) : dateOrIso
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 12)
}

// The next delivery on `day` that can still be changed (its cutoff hasn't passed).
export function nextDelivery(day, now = new Date()) {
  const jsDay = (delivery.days.indexOf(day) + 1) % 7
  for (let offset = 0; offset <= 8; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    if (date.getDay() === jsDay && now < cutoffFor(date)) return { date, cutoff: cutoffFor(date) }
  }
  return null
}

export function addDays(iso, days) {
  const date = fromISODate(iso)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}
