import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin, Bed } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { houseProperties } from '../data/properties'

const states = ['All States', 'Lagos', 'Abuja', 'Enugu', 'Port Harcourt', 'Ibadan']
const priceRanges = ['All Prices', 'Under ₦30M', '₦30M – ₦80M', '₦80M – ₦150M', '₦150M+']
const bedrooms = ['Any Bedrooms', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms']

export default function SellHouse() {
  const [search, setSearch] = useState('')
  const [state, setState] = useState('All States')

  const filtered = houseProperties.filter((p) => {
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
      <div className="bg-gradient-to-r from-forest to-forest-mid py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gold/70 text-sm mb-3">
            <MapPin size={14} />
            <span>Nigeria &rsaquo; Houses for Sale</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Sell &amp; Buy Houses</h1>
          <p className="text-white/70 text-lg max-w-xl">
            Browse verified residential properties or list your home for sale with full professional support.
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
              placeholder="Search by property name or location..."
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
            {priceRanges.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none bg-white">
            {bedrooms.map((b) => <option key={b}>{b}</option>)}
          </select>
          <button className="bg-forest text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors flex items-center justify-center gap-2 shrink-0">
            <SlidersHorizontal size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Sell CTA banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#x1F3E0;</span>
            <div>
              <p className="text-forest font-semibold text-sm">Want to sell your home?</p>
              <p className="text-gray-500 text-sm mt-0.5">
                List your property with us and reach thousands of verified buyers across Nigeria.
              </p>
            </div>
          </div>
          <button className="bg-forest text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-forest-light transition-colors shrink-0">
            List My Property
          </button>
        </div>
      </div>

      {/* Bedroom quick filter pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 flex-wrap">
          {['All', '3 Beds', '4 Beds', '5+ Beds', 'With Pool', 'Gated Estate'].map((label) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-forest hover:text-white hover:border-forest transition-colors"
            >
              {label === 'All' ? null : <Bed size={13} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
