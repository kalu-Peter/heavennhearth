import { supabase } from '../lib/supabase'

/** Sign in as admin */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/** Sign out */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Fetch the current user's profile */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

/** Update the current user's profile */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Fetch all admin profiles */
export async function getAdmins() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/**
 * Create a new admin account (auth user + profile row, the latter created
 * automatically by the `handle_new_user` DB trigger with role = 'admin').
 *
 * supabase.auth.signUp() replaces the *current* client session with the
 * newly created user's session, which would sign the calling admin out of
 * their own account — so we snapshot the current session first and restore
 * it once the new account has been created.
 */
export async function createAdmin({ email, password, fullName }) {
  const { data: { session: currentSession } } = await supabase.auth.getSession()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || null } },
  })

  if (currentSession) {
    await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token,
    })
  }

  if (error) throw error
  return data
}

/** Fetch dashboard stats for admin */
export async function getDashboardStats() {
  const [
    { count: totalProperties },
    { count: activeProperties },
    { count: newInquiries },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  return { totalProperties, activeProperties, newInquiries }
}
