import { delivery } from './site'

export const faqs = [
  {
    id: 'weekly-picks',
    question: 'How does the weekly box work?',
    answer: `You subscribe once a month and choose what goes in your box each week — up to 8 vegetables and 5 leafy greens or herbs. Update your picks any time until ${delivery.cutoff}, and your box arrives on ${delivery.day} morning.`,
  },
  {
    id: 'cutoff',
    question: `What happens if I miss the ${delivery.cutoff} cut-off?`,
    answer: `Your box is packed from the picks you last saved, so your next delivery is never empty. Changes made after ${delivery.cutoff} apply from the following week.`,
  },
  {
    id: 'not-home',
    question: "What if I'm not home for delivery?",
    answer:
      'Leave your crate slot or tell us a safe spot in delivery instructions — we leave your order there and text you a photo confirmation.',
  },
  {
    id: 'washing-grading',
    question: 'How are the vegetables prepared?',
    answer:
      'Everything is washed in fresh water, then hand-graded and sorted, so what reaches your crate is clean and only the best pieces make the cut.',
  },
  {
    id: 'payment',
    question: 'How do I pay?',
    answer: 'UPI, cards and net banking are all supported, and your monthly subscription can be set up on auto-pay.',
  },
  {
    id: 'cancellation',
    question: 'Can I cancel anytime?',
    answer:
      "Yes, with no lock-in. Cancel from your account and you'll keep your weekly deliveries until the month you've already paid for is used up.",
  },
  {
    id: 'delivery-areas',
    question: 'Which areas do you deliver to?',
    answer:
      "Use the pincode checker above — we're currently live across several Hyderabad, Chennai, Bengaluru, Pune and Delhi neighbourhoods and expanding monthly.",
  },
  {
    id: 'crate-return',
    question: 'How does the crate return work?',
    answer:
      'We drop a fresh crate and pick up the previous one on your next delivery — just leave it out, empty or not, and we handle the rest.',
  },
]
