import { createClient } from "@supabase/supabase-js"

// Fallbacks prevent build-time crashes during static generation when env vars
// are not yet set. The client is only used inside "use client" components / effects
// so these placeholders are never actually called with real network requests.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
