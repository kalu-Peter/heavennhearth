import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { farmProperties } from '../data/properties'

const states = ['All States', 'Kaduna', 'Benue State', 'Edo State', 'Niger State', 'Ogun State']
const sizes = ['All Sizes', 'Under 3 Hectares', '3 – 6 Hectares', '6 – 10 Hectares', '10 Hectares+']
const types = ['All Types', 'Crop Farming', 'Poultry', 'Fish Farming', 'Mixed Farming']

export default function RentFarm() {
  const [search, setSearch] = useState('')
  const [state, setState] = useState('All States')

  const filtered = farmProperties.filter((p) => {
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
      <div className="bg-gradient-to-r from-forest-light to-forest-mid py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gold/70 text-sm mb-3">
            <MapPin size={14} />
            <span>Nigeria &rsaquo; Farms for Rent</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Rent a Farm</h1>
          <p className="text-white/70 text-lg max-w-xl">
            Access fertile farmlands across Nigeria for agriculture, poultry, and agribusiness ventures.
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
              placeholder="Search by farm name or location..."
              className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
            />
          </div>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none bg-white"
          >
            {states.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none bg-white">
            {sizes.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none bg-white">
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
          <button className="bg-forest text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors flex items-center justify-center gap-2 shrink-0">
            <SlidersHorizontal size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-forest/5 border border-forest/20 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-2xl">&#x1F33F;</span>
          <div>
            <p className="text-forest font-semibold text-sm">Why Rent a Farm?</p>
            <p className="text-gray-500 text-sm mt-0.5">
              All our farm listings include access road, water source, and tenure-secure documentation for a worry-free farming experience.
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-gray-500 text-sm mb-6">
          Showing <span className="font-semibold text-forest">{filtered.length}</span> farms available
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
            <p className="text-gray-500 text-lg">No farms match your search.</p>
            <button
              onClick={() => { setSearch(''); setState('All States') }}
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
