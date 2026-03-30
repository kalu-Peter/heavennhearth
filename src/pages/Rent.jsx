import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PropertyCard from '../components/PropertyCard'

const PROPERTY_TYPES = ['All', 'farm', 'house', 'apartment', 'commercial']

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under KES 50k/mo',      min: 0,       max: 50_000 },
  { label: 'KES 50k – 150k/mo',     min: 50_000,  max: 150_000 },
  { label: 'KES 150k – 300k/mo',    min: 150_000, max: 300_000 },
  { label: 'KES 300k+/mo',          min: 300_000, max: Infinity },
]

function normalise(p) {
  const primary = p.property_images?.find((i) => i.is_primary) ?? p.property_images?.[0]
  return { ...p, primary_image: primary?.url ?? null, badge: p.badge ?? 'For Rent' }
}

function monthlyPrice(p) {
  return p.price_period === 'yearly' ? p.price / 12 : p.price
}

export default function Rent() {
  const [searchParams] = useSearchParams()

  const [properties, setProperties] = useState([])
  const [counties, setCounties]     = useState([])
  const [loading, setLoading]       = useState(true)

  const [search,     setSearch]     = useState(searchParams.get('q') ?? '')
  const [propType,   setPropType]   = useState(searchParams.get('type') ?? 'All')
  const [county,     setCounty]     = useState('All Counties')
  const [priceRange, setPriceRange] = useState(Number(searchParams.get('price') ?? '0'))

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('properties')
        .select('*, property_images(id, url, is_primary)')
        .eq('listing_type', 'rent')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      const normalised = (data ?? []).map(normalise)
      setProperties(normalised)
      const unique = ['All Counties', ...Array.from(
        new Set(normalised.map(p => p.county).filter(Boolean).sort())
      )]
      setCounties(unique)
      setLoading(false)
    }
    load()
  }, [])

  const range = PRICE_RANGES[priceRange]

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase()
    if (q && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q) && !(p.county ?? '').toLowerCase().includes(q)) return false
    if (propType !== 'All' && p.property_type !== propType) return false
    if (county !== 'All Counties' && p.county !== county) return false
    const mp = monthlyPrice(p)
    if (mp < range.min || mp > range.max) return false
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
            Properties for Rent
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Find farms, houses, apartments & commercial spaces to rent across Kenya
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or location…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          <select
            value={propType}
            onChange={(e) => setPropType(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <select
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {counties.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">
              {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} available
              {hasFilters ? ' (filtered)' : ''}
            </p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <SlidersHorizontal size={40} className="text-gray-300" />
                <p className="text-gray-400 font-medium">No properties match your filters</p>
                <button onClick={clearFilters} className="text-sm text-forest hover:underline">
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
