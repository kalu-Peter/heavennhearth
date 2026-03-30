import { supabase } from '../lib/supabase'

/** Submit a public inquiry for a property */
export async function submitInquiry({ propertyId, name, email, phone, message }) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({ property_id: propertyId, name, email, phone, message })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Fetch all inquiries (admin only) */
export async function getInquiries({ status } = {}) {
  let query = supabase
    .from('inquiries')
    .select('*, properties(title, location)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw error
  return data
}

/** Update inquiry status (admin only) */
export async function updateInquiryStatus(id, status) {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
