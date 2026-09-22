// >>> EDIT THIS ONE LINE to change the WhatsApp number used by the floating
// button, "Subscribe to this box", "Notify me" and the footer links.
// Format: country code + number, digits only (e.g. '919812345678').
// PLACEHOLDER — not a real number. Replace before launch.
export const WHATSAPP_NUMBER = '919000000000'

// The weekly rhythm, used by the hero, plans, builder, FAQ and WhatsApp message.
// Each customer picks a delivery day (any day of the week) and gets one box a
// week on that day. They can change their box until `cutoff` the day before;
// it arrives next morning, `time`.
export const delivery = {
  cutoff: '12 pm the day before',
  time: 'between 4 am - 7 am',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
}

// The day whose 12 pm is the order deadline for a delivery day.
export function cutoffDayFor(day) {
  const i = delivery.days.indexOf(day)
  return delivery.days[(i + delivery.days.length - 1) % delivery.days.length]
}

// Single place for the rest of the business details. Values marked PLACEHOLDER
// must be replaced before launch — each one is listed in TODO-content.md.
export const site = {
  name: 'Freshley',
  phone: { display: '+91 90000 00000', tel: '+919000000000' }, // PLACEHOLDER
  email: 'hello@freshley.in', // PLACEHOLDER
  // Your 14-digit FSSAI licence number. Leave '' and the footer badge stays hidden.
  fssaiLicence: '',
  social: {
    instagram: 'https://instagram.com/freshley.in', // PLACEHOLDER
    facebook: 'https://facebook.com/freshley.in', // PLACEHOLDER
    x: 'https://x.com/freshley_in', // PLACEHOLDER
  },
  legal: {
    privacy: '#', // PLACEHOLDER — needs a real page
    terms: '#', // PLACEHOLDER — needs a real page
    refund: '#', // PLACEHOLDER — needs a real page
  },
}
