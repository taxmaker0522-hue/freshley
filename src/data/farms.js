// Real partner farms go here. Empty until real data is supplied; while it is
// empty the "Know your farmer" section and its links are hidden.
// (Photos: see TODO-images.md.)
const realFarms = []

// Invented placeholders for reviewing the layout. import.meta.env.DEV is
// replaced with `false` at build time, so this branch is stripped from every
// production build and the sample text never ships.
const sampleFarms = import.meta.env.DEV
  ? [
      {
        id: 'ramulu',
        farmerName: 'Ramulu Naidu',
        village: 'Chittoor',
        distanceKm: 42,
        grows: ['Tomato', 'Brinjal', 'Okra'],
        farmingSince: 2014,
        sample: true,
      },
      {
        id: 'lakshmi',
        farmerName: 'Lakshmi Devi',
        village: 'Medak',
        distanceKm: 58,
        grows: ['Spinach', 'Methi', 'Coriander'],
        farmingSince: 2017,
        sample: true,
      },
      {
        id: 'venkatesh',
        farmerName: 'Venkatesh Reddy',
        village: 'Anantapur',
        distanceKm: 63,
        grows: ['Mango', 'Papaya', 'Banana'],
        farmingSince: 2011,
        sample: true,
      },
    ]
  : []

export const liveFarms = [...realFarms, ...sampleFarms]

// Real daily-harvest data, e.g. { pickedAt: '6:10 am', items: ['🍅 Tomato', ...] }.
// null hides the ticker.
const realHarvest = null

const sampleHarvest = import.meta.env.DEV
  ? {
      sample: true,
      pickedAt: '5:40 am',
      items: [
        '🍅 Tomato',
        '🥬 Spinach',
        '🥕 Carrot',
        '🌿 Curry leaves',
        '🍆 Brinjal',
        '🍌 Banana',
        '🌿 Coriander',
        '🍇 Grapes',
        '🥭 Mango',
        '🌿 Mint',
      ],
    }
  : null

export const todaysHarvest = realHarvest ?? sampleHarvest
