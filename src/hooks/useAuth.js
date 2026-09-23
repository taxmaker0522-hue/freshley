import { useSyncExternalStore } from 'react'
import { supabase } from '../lib/supabase'

// Customer accounts on Supabase: "Continue with Google" signs in, then the
// customer adds their mobile, alternate number and address (profiles table).
// status: 'unconfigured' (no .env keys) | 'loading' | 'signedOut'
//       | 'needsProfile' (signed in, no profile yet) | 'ready'
export const MOBILE_REGEX = /^[6-9][0-9]{9}$/

// What to do once sign-in finishes — survives the Google redirect.
const INTENT_KEY = 'freshley:after-login'

const EMPTY = { user: null, customer: null, subscription: null, orders: [], isAdmin: false }
let snapshot = { status: supabase ? 'loading' : 'unconfigured', ...EMPTY }
const listeners = new Set()

function set(patch) {
  snapshot = { ...snapshot, ...patch }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return snapshot
}

// ---- row <-> app shape

function customerFromRow(row) {
  return {
    name: row.name,
    mobile: row.mobile,
    altMobile: row.alt_mobile ?? '',
    address: { line1: row.address_line1, line2: row.address_line2, city: row.city, pincode: row.pincode },
  }
}

function customerToRow(profile) {
  return {
    name: profile.name,
    mobile: profile.mobile,
    alt_mobile: profile.altMobile || null,
    address_line1: profile.address.line1,
    address_line2: profile.address.line2,
    city: profile.address.city,
    pincode: profile.address.pincode,
  }
}

export function subscriptionFromRow(row) {
  return {
    id: row.id,
    status: row.status,
    deliveryDay: row.delivery_day,
    vegetables: row.vegetables,
    leafyGreens: row.leafy_greens,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
  }
}

export function orderFromRow(row) {
  return {
    id: row.id,
    deliveryDate: row.delivery_date,
    vegetables: row.vegetables,
    leafyGreens: row.leafy_greens,
    status: row.status,
    name: row.name,
    mobile: row.mobile,
    altMobile: row.alt_mobile,
    address: row.address,
    pincode: row.pincode,
  }
}

function friendlyError(error) {
  if (!error) return null
  if (error.code === '23505' && /mobile/.test(error.message)) return 'This mobile number is already linked to another account.'
  if (error.code === '23514') return 'Please check the details and try again.'
  return 'Something went wrong. Please try again in a moment.'
}

// ---- loading

async function load(user) {
  const [profile, sub, orders, admin] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('subscriptions').select('*').eq('customer_id', user.id).maybeSingle(),
    supabase.from('orders').select('*').eq('customer_id', user.id).order('delivery_date', { ascending: false }).limit(20),
    supabase.rpc('is_admin'),
  ])
  set({
    status: profile.data ? 'ready' : 'needsProfile',
    user,
    customer: profile.data ? customerFromRow(profile.data) : null,
    subscription: sub.data ? subscriptionFromRow(sub.data) : null,
    orders: (orders.data ?? []).map(orderFromRow),
    isAdmin: admin.data === true,
  })
}

export async function reloadAccount() {
  if (snapshot.user) await load(snapshot.user)
}

// The earlier browser-only prototype kept accounts here; clear them out.
try {
  window.localStorage.removeItem('freshley:customers')
  window.localStorage.removeItem('freshley:session')
} catch {
  // storage unavailable — nothing to clear
}

if (supabase) {
  let loadedFor = null
  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null
    if (!user) {
      loadedFor = null
      set({ status: 'signedOut', ...EMPTY })
      return
    }
    if (loadedFor === user.id) return // token refresh — nothing new to load
    loadedFor = user.id
    // Supabase advises not awaiting its own calls inside this callback.
    setTimeout(() => load(user), 0)
  })
}

// ---- actions (each returns an error message, or null on success)

export async function signInWithGoogle(intent = 'account') {
  try {
    window.sessionStorage.setItem(INTENT_KEY, intent)
  } catch {
    // no storage — sign-in still works, they just land on the home page
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
  })
  return error ? 'Could not open Google sign-in. Please try again.' : null
}

export function takePendingIntent({ keep = false } = {}) {
  try {
    const intent = window.sessionStorage.getItem(INTENT_KEY)
    if (!keep) window.sessionStorage.removeItem(INTENT_KEY)
    return intent
  } catch {
    return null
  }
}

export async function logOut() {
  await supabase.auth.signOut()
}

export async function saveProfile(profile) {
  const { error } = await supabase.from('profiles').upsert({ id: snapshot.user.id, ...customerToRow(profile) })
  if (error) return friendlyError(error)
  await reloadAccount()
  return null
}

// basket: { vegetables, leafyGreens, deliveryDay }
export async function saveSubscription(basket) {
  const { error } = await supabase.from('subscriptions').upsert(
    {
      customer_id: snapshot.user.id,
      status: 'active',
      delivery_day: basket.deliveryDay,
      vegetables: basket.vegetables,
      leafy_greens: basket.leafyGreens,
    },
    { onConflict: 'customer_id' },
  )
  if (error) return friendlyError(error)
  await reloadAccount()
  return null
}

// patch: { status } and/or { deliveryDay }
export async function patchSubscription(patch) {
  const row = {}
  if (patch.status) row.status = patch.status
  if (patch.deliveryDay) row.delivery_day = patch.deliveryDay
  const { error } = await supabase.from('subscriptions').update(row).eq('customer_id', snapshot.user.id)
  if (error) return friendlyError(error)
  await reloadAccount()
  return null
}

export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

// --- Sign-in sheet (one shared instance, opened from anywhere) ---
// intent: 'account' (go to the dashboard) or 'subscribe' (save the basket first)
let sheet = { open: false, intent: 'account' }
const sheetListeners = new Set()

export function openAuthSheet({ intent = 'account' } = {}) {
  sheet = { open: true, intent }
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
