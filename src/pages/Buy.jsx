import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PropertyCard from '../components/PropertyCard'

const PROPERTY_TYPES = ['All', 'house', 'land', 'apartment', 'villa', 'commercial']
const KENYAN_COUNTIES = [
  'All Counties','Nairobi','Mombasa','Kisumu','Nakuru','Kiambu','Machakos',
  'Kilifi','Meru','Nyeri','Nakuru','Kajiado','Kirinyaga','Murang\'a',
]

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under KES 5M',    min: 0,          max: 5_000_000 },
  { label: 'KES 5M – 15M',    min: 5_000_000,  max: 15_000_000 },
  { label: 'KES 15M – 30M',   min: 15_000_000, max: 30_000_000 },
  { label: 'KES 30M – 60M',   min: 30_000_000, max: 60_000_000 },
  { label: 'Above KES 60M',   min: 60_000_000, max: Infinity },
]

function toCardProp(p) {
  const primary = p.property_images?.find((i) => i.is_primary) ?? p.property_images?.[0]
  return {
    id:       p.id,
    title:    p.title,
    location: p.location + (p.county ? `, ${p.county} County` : ''),
    price:    `KES ${Number(p.price).toLocaleString()}`,
    area:     p.area_value ? `${p.area_value} ${p.area_unit}` : '–',
    type:     p.property_type,
    badge:    p.badge ?? 'For Sale',
    image:    primary?.url ?? '/hero.jpg',
    features: p.property_features?.map((f) => f.feature) ?? [],
    beds:     p.bedrooms  ?? undefined,
    baths:    p.bathrooms ?? undefined,
  }
}

export default function Buy() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)

  const [search,     setSearch]     = useState('')
  const [propType,   setPropType]   = useState('All')
  const [county,     setCounty]     = useState('All Counties')
  const [priceRange, setPriceRange] = useState(0) // index

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('properties')
        .select('*, property_images(id, url, is_primary), property_features(feature)')
        .eq('listing_type', 'buy')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      setProperties(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const range = PRICE_RANGES[priceRange]

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase()
    if (q && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false
    if (propType !== 'All' && p.property_type !== propType) return false
    if (county !== 'All Counties' && p.county !== county) return false
    if (p.price < range.min || p.price > range.max) return false
    return true
  })

  function clearFilters() {
    setSearch(''); setPropType('All'); setCounty('All Counties'); setPriceRange(0)
  }

  const hasFilters = search || propType !== 'All' || county !== 'All Counties' || priceRange !== 0

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-forest pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Properties for Sale
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Browse land, houses, villas & commercial properties across Kenya
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or location…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          {/* Property type */}
          <select
            value={propType}
            onChange={(e) => setPropType(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          {/* County */}
          <select
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {KENYAN_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Price */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {PRICE_RANGES.map((r, i) => (
              <option key={i} value={i}>{r.label}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">
              {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
              {hasFilters ? ' (filtered)' : ''}
            </p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={toCardProp(p)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <SlidersHorizontal size={40} className="text-gray-300" />
                <p className="text-gray-400 font-medium">No properties match your filters</p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-forest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
