/**
 * Seed script – creates a sample admin user in Supabase Auth + profiles table.
 *
 * Usage:
 *   node scripts/seed-admin.js
 *
 * Requirements:
 *   - .env must exist with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 *   - Email confirmation should be DISABLED in your Supabase project:
 *     Dashboard → Authentication → Providers → Email → uncheck "Confirm email"
 *   - The schema.sql trigger will auto-insert the profiles row on signup.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = resolve(__dirname, '../.env')
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const env = loadEnv()
const supabaseUrl     = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌  Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Sample admin credentials ──────────────────────────────────────────────────
const ADMIN = {
  email:     'heavennhearth.admin@gmail.com',
  password:  'Admin@Heaven2025',
  full_name: 'Heaven Admin',
}
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱  Seeding admin user: ${ADMIN.email}`)

  // 1. Sign up the user (trigger will create the profiles row automatically)
  const { data, error } = await supabase.auth.signUp({
    email:    ADMIN.email,
    password: ADMIN.password,
    options:  { data: { full_name: ADMIN.full_name } },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      console.log('ℹ️   User already exists — skipping signup.')
    } else {
      console.error('❌  signUp error:', error.message)
      process.exit(1)
    }
  } else {
    const userId = data.user?.id
    console.log(`✅  Auth user created  → ${userId}`)

    if (data.user && !data.session) {
      console.log('⚠️   Email confirmation is ON.')
      console.log('    Go to: Supabase Dashboard → Authentication → Users')
      console.log(`    Find "${ADMIN.email}" → click the 3-dot menu → "Send confirmation email" or "Confirm" directly.`)
      console.log('    Alternatively, disable email confirmation:')
      console.log('    Dashboard → Authentication → Providers → Email → uncheck "Confirm email" → Save\n')
    }
  }

  // 2. Verify the profiles row exists
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('email', ADMIN.email)
    .single()

  if (profileErr) {
    console.error('⚠️   Could not verify profile row:', profileErr.message)
    console.log('    This is expected if email confirmation is still pending.')
  } else {
    console.log('✅  Profile row confirmed:', profile)
  }

  console.log('\n🔑  Login credentials:')
  console.log(`    Email   : ${ADMIN.email}`)
  console.log(`    Password: ${ADMIN.password}`)
  console.log('    Route   : /admin/login\n')
}

main()
