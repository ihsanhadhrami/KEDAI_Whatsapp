import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public/browser use (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
// NEVER expose this to the client!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper function to check if we're on server
export const isServer = typeof window === 'undefined';

// Get the appropriate client based on context
export function getSupabaseClient(useAdmin = false) {
  if (useAdmin && !isServer) {
    throw new Error('Admin client can only be used on the server');
  }
  return useAdmin ? supabaseAdmin : supabase;
}
