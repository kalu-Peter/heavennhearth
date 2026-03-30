import { supabase } from '../lib/supabase'

/** Fetch all active properties, optionally filtered by listing_type */
export async function getProperties({ listingType, county, minPrice, maxPrice, propertyType } = {}) {
  let query = supabase
    .from('properties_summary')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (listingType)   query = query.eq('listing_type', listingType)
  if (county)        query = query.ilike('county', `%${county}%`)
  if (propertyType)  query = query.eq('property_type', propertyType)
  if (minPrice)      query = query.gte('price', minPrice)
  if (maxPrice)      query = query.lte('price', maxPrice)

  const { data, error } = await query
  if (error) throw error
  return data
}

/** Fetch a single property with images and features */
export async function getPropertyById(id) {
  const [{ data: property, error }, { data: images }, { data: features }] = await Promise.all([
    supabase.from('properties').select('*').eq('id', id).single(),
    supabase.from('property_images').select('*').eq('property_id', id).order('sort_order'),
    supabase.from('property_features').select('feature').eq('property_id', id),
  ])
  if (error) throw error
  return { ...property, images: images ?? [], features: features?.map(f => f.feature) ?? [] }
}

/** Create a new property (admin only) */
export async function createProperty(payload) {
  const { data, error } = await supabase
    .from('properties')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Update a property (admin only) */
export async function updateProperty(id, updates) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Delete a property (admin only) */
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) throw error
}

/** Upload a property image and register it in property_images */
export async function uploadPropertyImage(propertyId, file, { isPrimary = false, sortOrder = 0 } = {}) {
  const ext  = file.name.split('.').pop()
  const path = `${propertyId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(path, file)
  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(path)

  const { data, error } = await supabase
    .from('property_images')
    .insert({ property_id: propertyId, url: publicUrl, storage_path: path, is_primary: isPrimary, sort_order: sortOrder })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Add features/amenities to a property */
export async function addPropertyFeatures(propertyId, features = []) {
  const rows = features.map(feature => ({ property_id: propertyId, feature }))
  const { error } = await supabase.from('property_features').insert(rows)
  if (error) throw error
}
