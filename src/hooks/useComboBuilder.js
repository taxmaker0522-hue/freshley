import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useProducts } from './useProducts'

const STORAGE_KEY = 'freshley:combo-builder'

// The box is chosen weekly: up to 8 vegetables and 5 leafy greens or herbs.
export const LIMITS = {
  vegetables: { min: 1, max: 8 },
  leafyGreens: { min: 0, max: 5 },
}

const DEFAULT_STATE = {
  vegetables: [],
  leafyGreens: ['curry-leaves'],
  deliveryDay: null,
  pincode: '',
}

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
  })
}

// Puts a saved subscription basket back into the builder for editing.
function loadBasket(basket) {
  setState({
    ...state,
    vegetables: basket.vegetables,
    leafyGreens: basket.leafyGreens,
    deliveryDay: basket.deliveryDay,
  })
}

function setDeliveryDay(day) {
  setState({ ...state, deliveryDay: day })
}

function setPincode(code) {
  setState({ ...state, pincode: code })
}

export function useComboBuilder() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [blockedId, setBlockedId] = useState(null)

  useEffect(() => {
    if (!blockedId) return undefined
    const timeout = setTimeout(() => setBlockedId(null), 500)
    return () => clearTimeout(timeout)
  }, [blockedId])

  const { byId } = useProducts()

  // Only products still available count; one the admin switched off drops out.
  const basket = useMemo(() => {
    const keep = (ids) => ids.filter((id) => byId.get(id)?.available)
    return {
      vegetables: keep(snapshot.vegetables),
      leafyGreens: keep(snapshot.leafyGreens),
      deliveryDay: snapshot.deliveryDay,
    }
  }, [snapshot, byId])

  const selectedItems = useMemo(
    () => [...basket.vegetables, ...basket.leafyGreens].map((id) => byId.get(id)),
    [basket, byId],
  )

  const isComplete = basket.vegetables.length >= LIMITS.vegetables.min && Boolean(basket.deliveryDay)

  // True once the visitor has changed the box from the pre-selected default
  // (curry leaves only), so the mini-cart never appears on a first visit.
  const isDefaultBox =
    snapshot.vegetables.length === 0 &&
    snapshot.leafyGreens.length === DEFAULT_STATE.leafyGreens.length &&
    snapshot.leafyGreens.every((id, i) => id === DEFAULT_STATE.leafyGreens[i])
  const hasPicks = selectedItems.length > 0 && !isDefaultBox

  return {
    state: snapshot,
    toggleItem: (category, id) => {
      if (toggleItem(category, id)) setBlockedId(id)
    },
    applyPreset,
    loadBasket,
    setDeliveryDay,
    setPincode,
    blockedId,
    basket,
    selectedItems,
    isComplete,
    hasPicks,
  }
}
