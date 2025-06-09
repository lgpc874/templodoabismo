import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@shared/supabase'

// Simple configuration that works immediately
const supabaseUrl = 'https://placeholder.supabase.co'
const supabaseKey = 'placeholder-key'

// Initialize client with placeholder values
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseKey,
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

// Initialize with real configuration when available
let initialized = false
export async function initializeSupabase() {
  if (initialized) return supabase
  
  try {
    const response = await fetch('/api/config/supabase')
    if (response.ok) {
      const config = await response.json()
      
      // Update client with real configuration
      Object.assign(supabase, createClient(
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
      ))
      
      initialized = true
      console.log('Supabase client initialized with server configuration')
    }
  } catch (error) {
    console.warn('Using placeholder Supabase configuration')
  }
  
  return supabase
}