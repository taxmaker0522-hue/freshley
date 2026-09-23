import { useSyncExternalStore } from 'react'

// Three views, no router package: '#/dashboard' is the customer account,
// '#/admin' is the staff page, and any other hash (including in-page anchors
// like '#plans') shows the home page.
export const DASHBOARD_HASH = '#/dashboard'
export const ADMIN_HASH = '#/admin'

function subscribe(listener) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

function getSnapshot() {
  const { hash } = window.location
  if (hash.startsWith(DASHBOARD_HASH)) return 'dashboard'
  if (hash.startsWith(ADMIN_HASH)) return 'admin'
  return 'home'
}

export function goTo(hash) {
  if (window.location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'))
  else window.location.hash = hash
}

export function useRoute() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'home')
}
