import { plans } from '../data/plans'
import { WHATSAPP_NUMBER } from '../data/site'

const currency = new Intl.NumberFormat('en-IN')

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildGenericMessage() {
  return "Hi Freshley! I'd like to know more about your daily vegetable box."
}

export function buildBoxMessage(combo) {
  const { selectedItems, frequency, deliverySlot, pricePerDay, monthlyTotal, state } = combo
  const plan = plans.find((p) => p.id === state.planId)
  const items = selectedItems.map((item) => `${item.emoji} ${item.name}`).join(', ')

  return [
    "Hi Freshley! I'd like to subscribe to this box:",
    items,
    `Frequency: ${frequency.label} · Slot: ${deliverySlot.label}`,
    `Plan: ${plan ? `${plan.name} (${plan.duration})` : 'not chosen yet'}`,
    `Pincode: ${state.pincode || 'not checked yet'}`,
    `About ₹${pricePerDay}/day, roughly ₹${currency.format(monthlyTotal)} a month.`,
  ].join('\n')
}

export function buildNotifyMessage(pincode, contact) {
  return [
    `Hi Freshley! Please let me know when you start delivering to ${pincode}.`,
    contact ? `Reach me at: ${contact}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}
