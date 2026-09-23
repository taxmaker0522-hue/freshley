import { useSyncExternalStore } from 'react'
import { allProduce as staticProduce } from '../data/produce'
import { supabase } from '../lib/supabase'

// Products come from the `products` table (editable on the admin page).
// src/data/produce.js is the starting list and the fallback when the database
// can't be reached, so the basket builder always has something to show.
const staticById = new Map(staticProduce.map((item) => [item.id, item]))

function fromRow(row) {
  return {
    id: row.id,
    kind: row.kind,
    category: row.category,
    name: row.name,
    regionalName: { te: row.name_te ?? '', hi: row.name_hi ?? '' },
    emoji: row.emoji,
    // Device fallbacks for new emoji stay in code, matched by id.
    emojiFallback: staticById.get(row.id)?.emojiFallback,
    seasonal: row.seasonal,
    available: row.available,
    sort: row.sort,
  }
}

function toRow(product) {
  return {
    id: product.id,
    kind: product.kind,
    category: product.kind === 'vegetable' ? product.category : null,
    name: product.name,
    name_te: product.regionalName.te || null,
    name_hi: product.regionalName.hi || null,
    emoji: product.emoji,
    seasonal: product.seasonal,
    available: product.available,
    sort: product.sort,
  }
}

const staticList = staticProduce.map((item, i) => ({
  ...item,
  kind: item.category ? 'vegetable' : 'leafy',
  available: true,
  sort: (i + 1) * 10,
}))

let all = staticList
let snapshot = build()
const listeners = new Set()

function build() {
  const sorted = [...all].sort((a, b) => a.sort - b.sort)
  const available = sorted.filter((item) => item.available)
  return {
    all: sorted,
    byId: new Map(sorted.map((item) => [item.id, item])),
    vegetables: available.filter((item) => item.kind === 'vegetable'),
    leafyGreens: available.filter((item) => item.kind === 'leafy'),
  }
}

function setAll(next) {
  all = next
  snapshot = build()
  listeners.forEach((listener) => listener())
}

export async function refreshProducts() {
  if (!supabase) return
  const { data, error } = await supabase.from('products').select('*')
  if (!error && data?.length) setAll(data.map(fromRow))
}

// Admin only (enforced by Row Level Security). Returns an error message or null.
export async function saveProduct(product) {
  const { error } = await supabase.from('products').upsert(toRow(product))
  if (error) return error.message
  await refreshProducts()
  return null
}

export function getProducts() {
  return snapshot
}

refreshProducts()

export function useProducts() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getProducts,
    getProducts,
  )
}
