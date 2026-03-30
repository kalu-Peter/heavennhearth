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
