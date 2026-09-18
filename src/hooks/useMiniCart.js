import { useSyncExternalStore } from 'react'

// Whether the mobile mini-cart bar is currently shown, so other fixed
// elements (the WhatsApp button) can make room for it.
let visible = false
const listeners = new Set()

export function setMiniCartVisible(next) {
  if (visible === next) return
  visible = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return visible
}

export function useMiniCartVisible() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
