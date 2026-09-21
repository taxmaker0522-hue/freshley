import { monthlyPlan } from '../data/plans'
import { WHATSAPP_NUMBER, delivery } from '../data/site'

const currency = new Intl.NumberFormat('en-IN')

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildGenericMessage() {
  return "Hi Freshley! I'd like to know more about your weekly vegetable box."
}

export function buildBoxMessage(combo) {
  const { selectedItems, state } = combo
  const items = selectedItems.map((item) => `${item.emoji} ${item.name}`).join(', ')

  return [
    "Hi Freshley! I'd like to subscribe to this box:",
    items,
    `Delivery: every ${delivery.day} morning, ${delivery.time}`,
    `Plan: ${monthlyPlan.name} (₹${currency.format(monthlyPlan.basePrice)} a ${monthlyPlan.duration})`,
    `Pincode: ${state.pincode || 'not checked yet'}`,
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
