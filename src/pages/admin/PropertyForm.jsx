import { useState } from 'react'
import { X, Plus, Upload, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const PROPERTY_TYPES = ['land', 'house', 'apartment', 'farm', 'commercial', 'villa']
const AREA_UNITS     = ['sqm', 'acres', 'hectares', 'ft²']
const BADGES         = ['Hot Deal', 'New', 'Featured', 'For Sale', 'For Rent']
const KENYAN_COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Nyeri','Machakos',
  'Kiambu','Kilifi','Kwale','Taita-Taveta','Kajiado','Makueni','Kitui','Meru',
  'Embu','Tharaka-Nithi','Kirinyaga','Murang\'a','Nyandarua','Laikipia','Samburu',
  'Trans-Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Kericho','Bomet',
  'Kakamega','Vihiga','Bungoma','Busia','Siaya','Kisii','Nyamira','Migori','Homa Bay',
  'Narok','Turkana','West Pokot','Marsabit','Isiolo','Garissa','Wajir','Mandera',
  'Tana River','Lamu','Meru','Nyeri'
]

const empty = {
  title: '', description: '', listing_type: 'buy', property_type: 'house',
  price: '', price_period: '', area_value: '', area_unit: 'sqm',
  bedrooms: '', bathrooms: '', location: '', county: '', badge: 'For Sale',
  featured: false, status: 'active',
}

export default function PropertyForm({ initial = empty, onSaved, onCancel }) {
  const { user } = useAuth()
  const isEdit   = !!initial.id

  const [form, setForm]             = useState({ ...empty, ...initial })
  const [features, setFeatures]     = useState(initial.features ?? [])
  const [newFeature, setNewFeature] = useState('')
  const [images, setImages]         = useState([])   // File objects for upload
  const [existingImgs, setExistingImgs] = useState(initial.images ?? [])
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function addFeature() {
    const trimmed = newFeature.trim()
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((f) => [...f, trimmed])
    }
    setNewFeature('')
  }

  function removeFeature(feat) {
    setFeatures((f) => f.filter((x) => x !== feat))
  }

  function removeExistingImage(imgId) {
    setExistingImgs((imgs) => imgs.filter((i) => i.id !== imgId))
  }

  async function uploadImages(propertyId) {
    const uploaded = []
    for (const [idx, file] of images.entries()) {
      const ext  = file.name.split('.').pop()
      const path = `${propertyId}/${Date.now()}-${idx}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('property-images')
        .upload(path, file)
      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(path)

      uploaded.push({ property_id: propertyId, url: publicUrl, storage_path: path, is_primary: idx === 0 && existingImgs.length === 0, sort_order: idx })
    }
    return uploaded
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        title:        form.title,
        description:  form.description,
        listing_type: form.listing_type,
        property_type:form.property_type,
        price:        parseFloat(form.price),
        price_period: form.listing_type === 'rent' ? form.price_period || 'monthly' : null,
        area_value:   form.area_value ? parseFloat(form.area_value) : null,
        area_unit:    form.area_unit,
        bedrooms:     form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms:    form.bathrooms ? parseInt(form.bathrooms) : null,
        location:     form.location,
        county:       form.county,
        badge:        form.badge,
        featured:     form.featured,
        status:       form.status,
        created_by:   user?.id,
      }

      let propertyId = initial.id

      if (isEdit) {
        const { error: uErr } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', propertyId)
        if (uErr) throw uErr
      } else {
        const { data, error: iErr } = await supabase
          .from('properties')
          .insert(payload)
          .select('id')
          .single()
        if (iErr) throw iErr
        propertyId = data.id
      }

      // Sync features – delete all then re-insert
      await supabase.from('property_features').delete().eq('property_id', propertyId)
      if (features.length > 0) {
        await supabase.from('property_features').insert(
          features.map((f) => ({ property_id: propertyId, feature: f }))
        )
      }

      // Delete removed existing images
      const keptIds = existingImgs.map((i) => i.id)
      if (isEdit) {
        const { data: oldImgs } = await supabase
          .from('property_images')
          .select('id, storage_path')
          .eq('property_id', propertyId)
        const removed = (oldImgs ?? []).filter((i) => !keptIds.includes(i.id))
        for (const img of removed) {
          if (img.storage_path) {
            await supabase.storage.from('property-images').remove([img.storage_path])
          }
          await supabase.from('property_images').delete().eq('id', img.id)
        }
      }

      // Upload new images
      if (images.length > 0) {
        const newImgRows = await uploadImages(propertyId)
        await supabase.from('property_images').insert(newImgRows)
      }

      onSaved?.()
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
        <input
          required value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. 4-Bedroom Villa in Karen"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3} value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the property…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest resize-none"
        />
      </div>

      {/* Listing type + Property type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type *</label>
          <select
            required value={form.listing_type}
            onChange={(e) => {
              set('listing_type', e.target.value)
              set('badge', e.target.value === 'buy' ? 'For Sale' : 'For Rent')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="buy">Buy (For Sale)</option>
            <option value="rent">Rent (For Rent)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
          <select
            required value={form.property_type}
            onChange={(e) => set('property_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
          <input
            required type="number" min="0" step="1000" value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="e.g. 4500000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>
        {form.listing_type === 'rent' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent Period</label>
            <select
              value={form.price_period}
              onChange={(e) => set('price_period', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="monthly">Per Month</option>
              <option value="yearly">Per Year</option>
            </select>
          </div>
        )}
      </div>

      {/* Area */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area Size</label>
          <input
            type="number" min="0" step="0.01" value={form.area_value}
            onChange={(e) => set('area_value', e.target.value)}
            placeholder="e.g. 200"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area Unit</label>
          <select
            value={form.area_unit}
            onChange={(e) => set('area_unit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Beds & Baths (houses/apartments/villas) */}
      {['house', 'apartment', 'villa'].includes(form.property_type) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              type="number" min="0" max="20" value={form.bedrooms}
              onChange={(e) => set('bedrooms', e.target.value)}
              placeholder="e.g. 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number" min="0" max="20" value={form.bathrooms}
              onChange={(e) => set('bathrooms', e.target.value)}
              placeholder="e.g. 2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>
        </div>
      )}

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location / Area *</label>
          <input
            required value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Karen, Nairobi"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
          <select
            value={form.county}
            onChange={(e) => set('county', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="">Select county…</option>
            {KENYAN_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Badge, Status, Featured */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
          <select
            value={form.badge}
            onChange={(e) => set('badge', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="">None</option>
            {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-forest"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features / Amenities</label>
        <div className="flex gap-2 mb-2">
          <input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
            placeholder="e.g. Private Pool"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          />
          <button
            type="button" onClick={addFeature}
            className="px-3 py-2 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <span key={f} className="flex items-center gap-1 px-3 py-1 bg-cream-dark text-forest text-xs rounded-full font-medium">
              {f}
              <button type="button" onClick={() => removeFeature(f)} className="hover:text-red-500">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>

        {/* Existing images */}
        {existingImgs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {existingImgs.map((img) => (
              <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-forest transition-colors">
          <Upload size={20} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            {images.length > 0
              ? `${images.length} file(s) selected`
              : 'Click to upload images (JPG, PNG, WEBP)'}
          </span>
          <input
            type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button" onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit" disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-forest text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Property'}
        </button>
      </div>
    </form>
  )
}
