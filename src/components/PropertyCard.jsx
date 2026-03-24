import { useState } from 'react'
import { MapPin, Maximize2, Bed, Bath, ArrowRight, CheckCircle2, Heart } from 'lucide-react'

const badgeStyles = {
  'Hot Deal': 'bg-red-500 text-white',
  'New': 'bg-sky-500 text-white',
  'Featured': 'bg-gold text-forest',
  'For Sale': 'bg-forest text-white',
  'For Rent': 'bg-forest-mid text-white',
}

export default function PropertyCard({ property }) {
  const { title, location, price, area, badge, image, features, beds, baths } = property
  const [liked, setLiked] = useState(false)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
              badgeStyles[badge] ?? 'bg-gray-700 text-white'
            }`}
          >
            {badge}
          </span>
        )}
        {/* Heart / Favourite */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setLiked((v) => !v)
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            size={15}
            className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="shrink-0 text-forest-mid" />
          <span className="truncate">{location}</span>
        </div>

        <p className="text-forest font-extrabold text-xl mb-3">{price}</p>

        {/* Quick details */}
        <div className="flex items-center gap-4 text-gray-400 text-xs mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Maximize2 size={12} />
            <span>{area}</span>
          </div>
          {beds != null && (
            <div className="flex items-center gap-1">
              <Bed size={12} />
              <span>{beds} Beds</span>
            </div>
          )}
          {baths != null && (
            <div className="flex items-center gap-1">
              <Bath size={12} />
              <span>{baths} Baths</span>
            </div>
          )}
        </div>

        {/* Features */}
        {features?.length > 0 && (
          <ul className="flex flex-col gap-1.5 mb-4">
            {features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle2 size={11} className="text-forest-mid shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <button className="mt-auto w-full flex items-center justify-center gap-2 bg-forest text-white py-2.5 rounded-xl font-semibold hover:bg-forest-light transition-colors text-sm group/btn">
          View Details
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
