import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Maximize2, Bed, Bath, ArrowRight, Heart } from 'lucide-react'

const badgeStyles = {
  'Hot Deal': 'bg-red-500 text-white',
  'New':      'bg-sky-500 text-white',
  'Featured': 'bg-gold text-forest',
  'For Sale': 'bg-forest text-white',
  'For Rent': 'bg-forest-mid text-white',
}

function formatPrice(price, listingType, pricePeriod) {
  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 0,
  }).format(price)
  if (listingType === 'rent' && pricePeriod) return `${formatted} / ${pricePeriod}`
  return formatted
}

function formatArea(value, unit) {
  if (!value) return null
  return `${value} ${unit ?? 'sqm'}`
}

export default function PropertyCard({ property }) {
  const {
    id, title, location, price, listing_type, price_period,
    area_value, area_unit, badge, primary_image,
    bedrooms, bathrooms,
  } = property

  const [liked, setLiked] = useState(false)

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={primary_image ?? '/placeholder-property.jpg'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${badgeStyles[badge] ?? 'bg-gray-700 text-white'}`}>
            {badge}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((v) => !v) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="shrink-0 text-forest-mid" />
          <span className="truncate">{location}</span>
        </div>

        <p className="text-forest font-extrabold text-xl mb-3">
          {formatPrice(price, listing_type, price_period)}
        </p>

        <div className="flex items-center gap-4 text-gray-400 text-xs mb-4 flex-wrap">
          {area_value && (
            <div className="flex items-center gap-1">
              <Maximize2 size={12} />
              <span>{formatArea(area_value, area_unit)}</span>
            </div>
          )}
          {bedrooms != null && (
            <div className="flex items-center gap-1">
              <Bed size={12} />
              <span>{bedrooms} Beds</span>
            </div>
          )}
          {bathrooms != null && (
            <div className="flex items-center gap-1">
              <Bath size={12} />
              <span>{bathrooms} Baths</span>
            </div>
          )}
        </div>

        <Link
          to={`/property/${id}`}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-forest text-white py-2.5 rounded-lg font-semibold hover:bg-forest-light transition-colors text-sm group/btn"
        >
          View Details
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
