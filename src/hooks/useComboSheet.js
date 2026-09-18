import { useSyncExternalStore } from 'react'

let sheetOpen = false
const listeners = new Set()

function setComboSheetOpen(next) {
  sheetOpen = typeof next === 'function' ? next(sheetOpen) : next
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return sheetOpen
}

export function useComboSheetOpen() {
  const open = useSyncExternalStore(subscribe, getSnapshot)
  return [open, setComboSheetOpen]
}
