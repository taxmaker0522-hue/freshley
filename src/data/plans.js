export const householdSizes = [
  { id: 'small', label: '1–2 people', multiplier: 1 },
  { id: 'medium', label: '3–4 people', multiplier: 1.6 },
  { id: 'large', label: '5+ people', multiplier: 2.2 },
]

export const plans = [
  {
    id: 'trial',
    name: 'Trial week',
    duration: '7 days',
    basePrice: 349,
    discountPercent: 0,
    highlighted: false,
    description: 'Try Freshley with zero commitment.',
    features: [
      { label: 'One free swap', included: true },
      { label: 'Pause days', included: false },
      { label: 'Free delivery', included: true },
      { label: 'Returnable crate', included: true },
      { label: 'Free fruit on Sundays', included: false },
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    duration: '30 days',
    basePrice: 1499,
    discountPercent: 10,
    highlighted: true,
    description: 'Our most popular plan for everyday households.',
    features: [
      { label: 'Up to 4 swaps a month', included: true },
      { label: '4 pause days a month', included: true },
      { label: 'Free delivery', included: true },
      { label: 'Returnable crate', included: true },
      { label: 'Free fruit on Sundays', included: false },
    ],
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    duration: '90 days',
    basePrice: 3999,
    discountPercent: 18,
    highlighted: false,
    description: 'Best value, plus a sweet Sunday bonus.',
    features: [
      { label: 'Unlimited swaps', included: true },
      { label: '12 pause days a quarter', included: true },
      { label: 'Free delivery', included: true },
      { label: 'Returnable crate', included: true },
      { label: 'Free fruit on Sundays', included: true },
    ],
  },
]
