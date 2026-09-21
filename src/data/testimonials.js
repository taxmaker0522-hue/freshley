// Real, consented customer quotes go here, e.g.
// { id: 1, name: '...', location: '...', quote: '...' }. Empty until real data
// is supplied; while it is empty the Reviews section is hidden.
const realTestimonials = []

// Invented placeholders for reviewing the layout. import.meta.env.DEV is
// replaced with `false` at build time, so this branch is stripped from every
// production build and the sample text never ships.
const sampleTestimonials = import.meta.env.DEV
  ? [
      {
        id: 'sample-1',
        name: 'Sneha Reddy',
        location: 'Gachibowli, Hyderabad',
        quote: 'The tomatoes actually taste like tomatoes again. My kids ask for the carrots raw now.',
        sample: true,
      },
      {
        id: 'sample-2',
        name: 'Arjun Mehta',
        location: 'Kondapur, Hyderabad',
        quote: 'Pausing during our Goa trip took ten seconds in the app. No calls, no awkward refund chats.',
        sample: true,
      },
      {
        id: 'sample-3',
        name: 'Priya Iyer',
        location: 'Banjara Hills, Hyderabad',
        quote: 'Everything shows up before I leave for work. The crate goes back empty, no plastic guilt.',
        sample: true,
      },
      {
        id: 'sample-4',
        name: 'Rohit Sharma',
        location: 'Jubilee Hills, Hyderabad',
        quote: 'Switched from the Sunday mandi trip entirely. Quality is more consistent, honestly.',
        sample: true,
      },
      {
        id: 'sample-5',
        name: 'Kavita Rao',
        location: 'Madhapur, Hyderabad',
        quote: "My mother-in-law inspects everything and still hasn't found a complaint. That's the real review.",
        sample: true,
      },
      {
        id: 'sample-6',
        name: 'Faisal Ahmed',
        location: 'Begumpet, Hyderabad',
        quote: 'The monthly plan paid for itself in two months. Sunday morning delivery suits us perfectly.',
        sample: true,
      },
    ]
  : []

export const liveTestimonials = [...realTestimonials, ...sampleTestimonials]
