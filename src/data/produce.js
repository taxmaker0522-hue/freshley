// Regional names: te = Telugu, hi = Hindi
// seasonal: true if availability varies by season
// category (vegetables only): a key from vegetableCategories, used to show one group at a time
// icon (optional): a React SVG component; when present it replaces `emoji`
//   everywhere via <ProduceGlyph /> — see TODO-content.md "SVG produce illustrations"
// emojiFallback (optional): shown instead of `emoji` on devices that cannot draw
//   it (newer emoji render as an empty box on Windows 10 / older Androids)

export const vegetableCategories = [
  { id: 'everyday', label: 'Everyday veg' },
  { id: 'roots', label: 'Roots & bulbs' },
  { id: 'gourds', label: 'Gourds' },
  { id: 'cabbage-family', label: 'Cabbage family' },
  { id: 'beans', label: 'Beans & pods' },
]

export const vegetables = [
  {
    id: 'tomato',
    category: 'everyday',
    name: 'Tomato',
    regionalName: { te: 'టమాటా', hi: 'टमाटर' },
    emoji: '🍅',
    seasonal: false,
  },
  {
    id: 'onion',
    category: 'roots',
    name: 'Onion',
    regionalName: { te: 'ఉల్లిపాయ', hi: 'प्याज' },
    emoji: '🧅',
    seasonal: false,
  },
  {
    id: 'potato',
    category: 'roots',
    name: 'Potato',
    regionalName: { te: 'బంగాళదుంప', hi: 'आलू' },
    emoji: '🥔',
    seasonal: false,
  },
  {
    id: 'brinjal',
    category: 'everyday',
    name: 'Brinjal',
    regionalName: { te: 'వంకాయ', hi: 'बैंगन' },
    emoji: '🍆',
    seasonal: false,
  },
  {
    id: 'okra',
    category: 'everyday',
    name: 'Okra',
    regionalName: { te: 'బెండకాయ', hi: 'भिंडी' },
    emoji: '🌿',
    seasonal: true,
  },
  {
    id: 'cauliflower',
    category: 'cabbage-family',
    name: 'Cauliflower',
    regionalName: { te: 'కాలీఫ్లవర్', hi: 'फूलगोभी' },
    emoji: '🥦',
    seasonal: true,
  },
  {
    id: 'cabbage',
    category: 'cabbage-family',
    name: 'Cabbage',
    regionalName: { te: 'క్యాబేజీ', hi: 'पत्तागोभी' },
    emoji: '🥬',
    seasonal: false,
  },
  {
    id: 'carrot',
    category: 'roots',
    name: 'Carrot',
    regionalName: { te: 'క్యారెట్', hi: 'गाजर' },
    emoji: '🥕',
    seasonal: false,
  },
  {
    id: 'beetroot',
    category: 'roots',
    name: 'Beetroot',
    regionalName: { te: 'బీట్‌రూట్', hi: 'चुकंदर' },
    emoji: '🍠',
    seasonal: false,
  },
  {
    id: 'cucumber',
    category: 'everyday',
    name: 'Cucumber',
    regionalName: { te: 'దోసకాయ', hi: 'खीरा' },
    emoji: '🥒',
    seasonal: false,
  },
  {
    id: 'bottle-gourd',
    category: 'gourds',
    name: 'Bottle Gourd',
    regionalName: { te: 'సొరకాయ', hi: 'लौकी' },
    emoji: '🥒',
    seasonal: false,
  },
  {
    id: 'ridge-gourd',
    category: 'gourds',
    name: 'Ridge Gourd',
    regionalName: { te: 'బీరకాయ', hi: 'तोरई' },
    emoji: '🥒',
    seasonal: true,
  },
  {
    id: 'capsicum',
    category: 'everyday',
    name: 'Capsicum',
    regionalName: { te: 'క్యాప్సికం', hi: 'शिमला मिर्च' },
    emoji: '🫑',
    emojiFallback: '🌶️',
    seasonal: false,
  },
  {
    id: 'cluster-beans',
    category: 'beans',
    name: 'Cluster Beans',
    regionalName: { te: 'గోరు చిక్కుడు', hi: 'ग्वार फली' },
    emoji: '🫘',
    emojiFallback: '🌱',
    seasonal: true,
  },
]

export const leafyGreens = [
  {
    id: 'curry-leaves',
    name: 'Curry Leaves',
    regionalName: { te: 'కరివేపాకు', hi: 'करी पत्ता' },
    emoji: '🌿',
    seasonal: false,
  },
  {
    id: 'coriander',
    name: 'Coriander',
    regionalName: { te: 'కొత్తిమీర', hi: 'धनिया' },
    emoji: '🌿',
    seasonal: false,
  },
  {
    id: 'mint',
    name: 'Mint',
    regionalName: { te: 'పుదీనా', hi: 'पुदीना' },
    emoji: '🌱',
    seasonal: false,
  },
  {
    id: 'spinach',
    name: 'Spinach',
    regionalName: { te: 'పాలకూర', hi: 'पालक' },
    emoji: '🥬',
    seasonal: false,
  },
  {
    id: 'methi',
    name: 'Fenugreek Leaves',
    regionalName: { te: 'మెంతికూర', hi: 'मेथी' },
    emoji: '🌿',
    seasonal: true,
  },
  {
    id: 'dill',
    name: 'Dill Leaves',
    regionalName: { te: 'సబ్బసిగ్గ ఆకు', hi: 'सोआ' },
    emoji: '🌿',
    seasonal: true,
  },
  {
    id: 'amaranth',
    name: 'Amaranth Leaves',
    regionalName: { te: 'తోటకూర', hi: 'चौलाई' },
    emoji: '🌿',
    seasonal: true,
  },
  {
    id: 'drumstick-leaves',
    name: 'Drumstick Leaves',
    regionalName: { te: 'మునగాకు', hi: 'सहजन के पत्ते' },
    emoji: '🌿',
    seasonal: true,
  },
]

export const allProduce = [...vegetables, ...leafyGreens]
