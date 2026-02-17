'use strict';

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required env vars: SUPABASE_URL and SUPABASE_ANON_KEY');
}

/**
 * Public Supabase client — uses anon key.
 * Use for operations on behalf of authenticated users (JWT passed per request).
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Admin Supabase client — uses service role key (bypasses RLS).
 * Only use server-side for trusted operations (e.g., creating user records on signup).
 * Falls back to anon client if service key is not set.
 */
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

module.exports = { supabase, supabaseAdmin };
