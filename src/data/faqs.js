import { delivery } from './site'

export const faqs = [
  {
    id: 'weekly-picks',
    question: 'How does the weekly box work?',
    answer: `You subscribe once a month, pick a delivery day, and choose what goes in your box each week — up to 8 vegetables and 5 leafy greens or herbs. Order or change your picks any time until ${delivery.cutoff}, and your box arrives the next morning, ${delivery.time}. It then repeats weekly on the same day.`,
  },
  {
    id: 'delivery-day',
    question: 'Which day will my box arrive?',
    answer: `Any day of the week — you choose. For example, order by 12 pm on Monday and your box arrives on Tuesday morning, ${delivery.time}, and then every Tuesday after that.`,
  },
  {
    id: 'cutoff',
    question: 'What happens if I miss the 12 pm cut-off?',
    answer: `Your box is packed from the picks you last saved, so your next delivery is never empty. Changes made after ${delivery.cutoff} apply from the following week.`,
  },
  {
    id: 'not-home',
    question: "What if I'm not home for delivery?",
    answer:
      'Leave your crate slot or tell us a safe spot in delivery instructions — we leave your order there and text you a photo confirmation.',
  },
  {
    id: 'harvest-grading',
    question: 'Where do the vegetables come from?',
    answer:
      'Our vegetables are harvested at farms that sit on fresh water sources, then hand-graded and sorted, so only the best pieces make it into your crate.',
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
