import { useSyncExternalStore } from 'react'

// PROTOTYPE ACCOUNTS — stored in this browser only (localStorage). There is no
// server yet, so nobody is verified (no OTP) and an account does not follow the
// customer to another phone. Swap these functions for real API calls
// (e.g. Supabase) later; the components only use the exported API below.
const CUSTOMERS_KEY = 'freshley:customers'
const SESSION_KEY = 'freshley:session'

export const MOBILE_REGEX = /^[6-9][0-9]{9}$/

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode / quota) — account lasts for this visit only
  }
}

// customers: { [mobile]: { profile, subscription } }
let customers = typeof window === 'undefined' ? {} : read(CUSTOMERS_KEY, {})
let session = typeof window === 'undefined' ? null : read(SESSION_KEY, null)
let snapshot = buildSnapshot()
const listeners = new Set()

function buildSnapshot() {
  const record = session ? customers[session] : null
  return { customer: record?.profile ?? null, subscription: record?.subscription ?? null }
}

function emit() {
  write(CUSTOMERS_KEY, customers)
  write(SESSION_KEY, session)
  snapshot = buildSnapshot()
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return snapshot
}

function updateRecord(patch) {
  if (!session) return
  customers = { ...customers, [session]: { ...customers[session], ...patch } }
  emit()
}

export function isRegistered(mobile) {
  return Boolean(customers[mobile])
}

// Returns an error message, or null on success.
export function signUp(profile) {
  if (customers[profile.mobile]) return 'This number already has an account. Log in instead.'
  customers = {
    ...customers,
    [profile.mobile]: { profile: { ...profile, joinedAt: new Date().toISOString() }, subscription: null },
  }
  session = profile.mobile
  emit()
  return null
}

export function logIn(mobile) {
  if (!customers[mobile]) return 'No account with this number yet. Sign up below.'
  session = mobile
  emit()
  return null
}

export function logOut() {
  session = null
  emit()
}

export function updateProfile(profile) {
  if (!session) return
  updateRecord({ profile: { ...customers[session].profile, ...profile, mobile: session } })
}

// basket: { vegetables, leafyGreens, deliveryDay }
export function saveSubscription(basket) {
  if (!session) return
  const current = customers[session].subscription
  updateRecord({
    subscription: {
      status: 'active',
      startedAt: new Date().toISOString(),
      whatsappSentAt: null,
      ...current,
      vegetables: basket.vegetables,
      leafyGreens: basket.leafyGreens,
      deliveryDay: basket.deliveryDay,
      updatedAt: new Date().toISOString(),
    },
  })
}

export function patchSubscription(patch) {
  if (!session || !customers[session].subscription) return
  updateRecord({ subscription: { ...customers[session].subscription, ...patch } })
}

export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

// --- Login / sign-up sheet (one shared instance, opened from anywhere) ---
// intent: 'account' (go to dashboard) or 'subscribe' (save the basket first)
let sheet = { open: false, mode: 'login', intent: 'account' }
const sheetListeners = new Set()

export function openAuthSheet({ mode = 'login', intent = 'account' } = {}) {
  sheet = { open: true, mode, intent }
  sheetListeners.forEach((listener) => listener())
}

export function closeAuthSheet() {
  sheet = { ...sheet, open: false }
  sheetListeners.forEach((listener) => listener())
}

export function useAuthSheet() {
  return useSyncExternalStore(
    (listener) => {
      sheetListeners.add(listener)
      return () => sheetListeners.delete(listener)
    },
    () => sheet,
    () => sheet,
  )
}
