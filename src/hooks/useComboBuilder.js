import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { allProduce } from '../data/produce'

const STORAGE_KEY = 'freshley:combo-builder'

export const LIMITS = {
  vegetables: { min: 3, max: 3 },
  leafyGreens: { min: 2, max: 2 },
  fruits: { min: 0, max: 2 },
}

export const FREQUENCIES = [
  { id: 'daily', label: 'Daily', daysPerMonth: 30 },
  { id: 'weekdays', label: 'Weekdays only', daysPerMonth: 22 },
  { id: 'alternate', label: 'Alternate days', daysPerMonth: 15 },
]

export const DELIVERY_SLOTS = [
  { id: '6-7', label: '6 – 7 am' },
  { id: '7-8', label: '7 – 8 am' },
]

const DEFAULT_STATE = {
  vegetables: [],
  leafyGreens: ['curry-leaves'],
  fruits: [],
  frequency: 'daily',
  deliverySlot: '6-7',
}

const produceById = new Map(allProduce.map((item) => [item.id, item]))

function loadState() {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

function persist(next) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable (private mode / quota) — combo still works in-memory
  }
}

// One shared store so the builder, mini-cart bar and WhatsApp button stay in sync.
let state = loadState()
const listeners = new Set()

function setState(next) {
  state = next
  persist(state)
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

// Returns true when the pick was refused because the category is full.
function toggleItem(category, id) {
  const selected = state[category]
  if (selected.includes(id)) {
    setState({ ...state, [category]: selected.filter((itemId) => itemId !== id) })
    return false
  }
  if (selected.length >= LIMITS[category].max) return true
  setState({ ...state, [category]: [...selected, id] })
  return false
}

function applyPreset(preset) {
  setState({
    ...state,
    vegetables: preset.vegetables,
    leafyGreens: preset.leafyGreens,
    fruits: preset.fruits,
  })
}

function setFrequency(id) {
  setState({ ...state, frequency: id })
}

function setDeliverySlot(id) {
  setState({ ...state, deliverySlot: id })
}

export function useComboBuilder() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [blockedId, setBlockedId] = useState(null)

  useEffect(() => {
    if (!blockedId) return undefined
    const timeout = setTimeout(() => setBlockedId(null), 500)
    return () => clearTimeout(timeout)
  }, [blockedId])

  const selectedItems = useMemo(
    () =>
      [...snapshot.vegetables, ...snapshot.leafyGreens, ...snapshot.fruits]
        .map((id) => produceById.get(id))
        .filter(Boolean),
    [snapshot],
  )

  const pricePerDay = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.pricePerDay, 0),
    [selectedItems],
  )

  const frequency = FREQUENCIES.find((f) => f.id === snapshot.frequency) ?? FREQUENCIES[0]
  const deliverySlot = DELIVERY_SLOTS.find((s) => s.id === snapshot.deliverySlot) ?? DELIVERY_SLOTS[0]
  const monthlyTotal = pricePerDay * frequency.daysPerMonth

  const isComplete =
    snapshot.vegetables.length === LIMITS.vegetables.max &&
    snapshot.leafyGreens.length === LIMITS.leafyGreens.max

  return {
    state: snapshot,
    toggleItem: (category, id) => {
      if (toggleItem(category, id)) setBlockedId(id)
    },
    applyPreset,
    setFrequency,
    setDeliverySlot,
    blockedId,
    selectedItems,
    pricePerDay,
    monthlyTotal,
    frequency,
    deliverySlot,
    isComplete,
  }
}
