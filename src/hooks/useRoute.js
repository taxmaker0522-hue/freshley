import { useSyncExternalStore } from 'react'

// Two views, no router package: '#/dashboard' shows the account page, any
// other hash (including in-page anchors like '#plans') shows the home page.
export const DASHBOARD_HASH = '#/dashboard'

function subscribe(listener) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

function getSnapshot() {
  return window.location.hash.startsWith(DASHBOARD_HASH) ? 'dashboard' : 'home'
}

export function goTo(hash) {
  if (window.location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'))
  else window.location.hash = hash
}

export function useRoute() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'home')
}
