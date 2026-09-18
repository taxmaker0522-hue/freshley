import { useEffect, useMemo, useState } from 'react'
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

export function getStoredComboSummary() {
  const state = loadState()
  const items = [...state.vegetables, ...state.leafyGreens, ...state.fruits]
    .map((id) => produceById.get(id))
    .filter(Boolean)
  const pricePerDay = items.reduce((sum, item) => sum + item.pricePerDay, 0)

  return { items, pricePerDay, frequency: state.frequency, deliverySlot: state.deliverySlot }
}

export function useComboBuilder() {
  const [state, setState] = useState(loadState)
  const [blockedId, setBlockedId] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable (private mode / quota) — combo still works in-memory
    }
  }, [state])

  useEffect(() => {
    if (!blockedId) return undefined
    const timeout = setTimeout(() => setBlockedId(null), 500)
    return () => clearTimeout(timeout)
  }, [blockedId])

  function toggleItem(category, id) {
    setState((prev) => {
      const selected = prev[category]
      const isSelected = selected.includes(id)

      if (isSelected) {
        return { ...prev, [category]: selected.filter((itemId) => itemId !== id) }
      }
      if (selected.length >= LIMITS[category].max) {
        setBlockedId(id)
        return prev
      }
      return { ...prev, [category]: [...selected, id] }
    })
  }

  function applyPreset(preset) {
    setState((prev) => ({
      ...prev,
      vegetables: preset.vegetables,
      leafyGreens: preset.leafyGreens,
      fruits: preset.fruits,
    }))
  }

  function setFrequency(id) {
    setState((prev) => ({ ...prev, frequency: id }))
  }

  function setDeliverySlot(id) {
    setState((prev) => ({ ...prev, deliverySlot: id }))
  }

  const selectedItems = useMemo(
    () =>
      [...state.vegetables, ...state.leafyGreens, ...state.fruits]
        .map((id) => produceById.get(id))
        .filter(Boolean),
    [state.vegetables, state.leafyGreens, state.fruits],
  )

  const pricePerDay = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.pricePerDay, 0),
    [selectedItems],
  )

  const frequency = FREQUENCIES.find((f) => f.id === state.frequency) ?? FREQUENCIES[0]
  const monthlyTotal = pricePerDay * frequency.daysPerMonth

  const isComplete =
    state.vegetables.length === LIMITS.vegetables.max &&
    state.leafyGreens.length === LIMITS.leafyGreens.max

  return {
    state,
    toggleItem,
    applyPreset,
    setFrequency,
    setDeliverySlot,
    blockedId,
    selectedItems,
    pricePerDay,
    monthlyTotal,
    frequency,
    isComplete,
  }
}
