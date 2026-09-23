import { monthlyPlan } from '../data/plans'
import { WHATSAPP_NUMBER, delivery } from '../data/site'

const currency = new Intl.NumberFormat('en-IN')

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildGenericMessage() {
  return "Hi Freshley! I'd like to know more about your weekly vegetable basket."
}

export function buildBoxMessage(combo) {
  const { selectedItems, state } = combo
  const items = selectedItems.map((item) => `${item.emoji} ${item.name}`).join(', ')

  return [
    "Hi Freshley! I'd like to subscribe to this basket:",
    items,
    `Delivery: every ${state.deliveryDay}, ${delivery.time}`,
    `Plan: ${monthlyPlan.name} (₹${currency.format(monthlyPlan.basePrice)} a ${monthlyPlan.duration})`,
    `Pincode: ${state.pincode || 'not checked yet'}`,
  ].join('\n')
}

// Sent from the dashboard: the account has no server yet, so WhatsApp is how
// Freshley actually receives the subscription and the customer's details.
export function buildSubscriptionMessage(customer, subscription, items) {
  const { address } = customer
  return [
    subscription.whatsappSentAt ? 'Hi Freshley! I have updated my subscription:' : "Hi Freshley! I've subscribed on the website:",
    `Name: ${customer.name}`,
    `Mobile: +91 ${customer.mobile}`,
    customer.altMobile ? `Alternate: +91 ${customer.altMobile}` : null,
    `Address: ${address.line1}, ${address.line2}, ${address.city} ${address.pincode}`,
    `Basket: ${items.map((item) => `${item.emoji} ${item.name}`).join(', ')}`,
    `Delivery: every ${subscription.deliveryDay}, ${delivery.time}`,
    subscription.status === 'paused' ? 'Status: paused' : null,
    `Plan: ${monthlyPlan.name} (₹${currency.format(monthlyPlan.basePrice)} a ${monthlyPlan.duration})`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function buildNotifyMessage(pincode, contact) {
  return [
    `Hi Freshley! Please let me know when you start delivering to ${pincode}.`,
    contact ? `Reach me at: ${contact}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}
