import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Define the expected structure for environment variables
interface Env {
  SUPABASE_KEY: string
}

const supabaseUrl = 'https://yhptstizqxhcvrgyrgpa.supabase.co'
let supabase: SupabaseClient | null = null

export function initializeSupabase(env: Env): void {
  if (!supabase) {
    const supabaseKey = env.SUPABASE_KEY
    if (!supabaseKey) {
      throw new Error('SUPABASE_KEY environment variable is not set.')
    }
    supabase = createClient(supabaseUrl, supabaseKey)
  }
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase client has not been initialized. Call initializeSupabase first.')
  }
  return supabase
}
