import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@shared/supabase'

// Configuration will be loaded dynamically
let supabaseClient: SupabaseClient<Database> | null = null
let configPromise: Promise<SupabaseClient<Database>> | null = null

async function createSupabaseClient(): Promise<SupabaseClient<Database>> {
  try {
    const response = await fetch('/api/config/supabase')
    if (!response.ok) {
      throw new Error('Failed to fetch Supabase configuration')
    }
    
    const config = await response.json()
    
    return createClient(
      config.url,
      config.key,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    )
  } catch (error) {
    console.error('Supabase configuration error:', error)
    throw error
  }
}

export async function getSupabase(): Promise<SupabaseClient<Database>> {
  if (supabaseClient) {
    return supabaseClient
  }
  
  if (!configPromise) {
    configPromise = createSupabaseClient()
  }
  
  supabaseClient = await configPromise
  return supabaseClient
}

// Proxy object for synchronous access (will throw if not initialized)
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(target, prop) {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized. Use getSupabase() for proper initialization.')
    }
    const value = (supabaseClient as any)[prop]
    return typeof value === 'function' ? value.bind(supabaseClient) : value
  }
})