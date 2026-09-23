import { createClient } from '@supabase/supabase-js'

// Set these two in `.env` (see SETUP-backend.md). The anon key is public by
// design; Row Level Security in supabase/schema.sql is what protects data.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// null until configured: the site then still works for browsing and building
// a basket, and the account buttons explain that sign-in isn't set up yet.
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        // PKCE returns `?code=` in the query string, leaving the #/dashboard
        // hash routes alone.
        auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true },
      })
    : null
