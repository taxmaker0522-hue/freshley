import { delivery } from './site'

// One monthly subscription. What goes in the box is chosen weekly (see
// useComboBuilder LIMITS), so there is no per-week or per-item price.
export const monthlyPlan = {
  id: 'monthly',
  name: 'Monthly subscription',
  duration: 'month',
  basePrice: 1499, // PLACEHOLDER — invented number, replace before launch
  description: 'One monthly subscription. You choose what goes in your box each week.',
  features: [
    `A fresh box delivered every ${delivery.day} morning, ${delivery.time}`,
    'Up to 8 vegetables and 5 leafy greens each week',
    `Change your picks any time until ${delivery.cutoff}`,
    'Free delivery',
    'Returnable crate',
  ],
}
