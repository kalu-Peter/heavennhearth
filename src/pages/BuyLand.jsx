import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { landProperties } from '../data/properties'

const states = ['All States', 'Lagos', 'Abuja', 'Ogun State', 'Enugu', 'Rivers State']
const sizes = ['All Sizes', 'Under 300 sqm', '300 – 600 sqm', '600 sqm – 1 Hectare', '1 Hectare+']

export default function BuyLand() {
  const [search, setSearch] = useState('')
  const [state, setState] = useState('All States')
  const [size, setSize] = useState('All Sizes')

  const filtered = landProperties.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchState = state === 'All States' || p.location.includes(state)
    return matchSearch && matchState
  })

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-gradient-to-r from-forest to-forest-light py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gold/70 text-sm mb-3">
            <MapPin size={14} />
            <span>Nigeria &rsaquo; Land for Sale</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Buy Land</h1>
          <p className="text-white/70 text-lg max-w-xl">
            Discover premium plots and acres with verified documentation across Nigeria.
          </p>
        </div>
      </div>

      {/* Search / filter bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
            <Search size={17} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or location..."
              className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none bg-white"
          >
            {sizes.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none bg-white"
          >
            {states.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="bg-forest text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors flex items-center justify-center gap-2 shrink-0">
            <SlidersHorizontal size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500 text-sm mb-6">
          Showing <span className="font-semibold text-forest">{filtered.length}</span> properties
        </p>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">&#x1F50D;</p>
            <p className="text-gray-500 text-lg">No properties match your search.</p>
            <button
              onClick={() => { setSearch(''); setState('All States'); setSize('All Sizes') }}
              className="mt-4 text-forest font-semibold text-sm underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
