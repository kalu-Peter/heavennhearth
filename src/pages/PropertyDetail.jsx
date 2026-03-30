import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Maximize2, Bed, Bath,
  CheckCircle2, Phone, Mail, ChevronLeft, ChevronRight,
  Home, Tag, Calendar,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

function formatPrice(price, listingType, pricePeriod) {
  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 0,
  }).format(price)
  if (listingType === 'rent' && pricePeriod) return `${formatted} / ${pricePeriod}`
  return formatted
}

const badgeStyles = {
  'Hot Deal': 'bg-red-500 text-white',
  'New':      'bg-sky-500 text-white',
  'Featured': 'bg-gold text-forest',
  'For Sale': 'bg-forest text-white',
  'For Rent': 'bg-forest-mid text-white',
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [property, setProperty]   = useState(null)
  const [images, setImages]       = useState([])
  const [features, setFeatures]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  const [inquiry, setInquiry]     = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending]     = useState(false)
  const [sent, setSent]           = useState(false)
  const [sendErr, setSendErr]     = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: prop }, { data: imgs }, { data: feats }] = await Promise.all([
        supabase.from('properties').select('*').eq('id', id).single(),
        supabase.from('property_images').select('*').eq('property_id', id).order('sort_order'),
        supabase.from('property_features').select('feature').eq('property_id', id),
      ])
      if (!prop) { navigate('/buy', { replace: true }); return }
      setProperty(prop)
      setImages(imgs ?? [])
      setFeatures(feats?.map(f => f.feature) ?? [])
      setLoading(false)
    }
    load()
  }, [id, navigate])

  function prevImg() { setActiveImg(i => (i - 1 + images.length) % images.length) }
  function nextImg() { setActiveImg(i => (i + 1) % images.length) }

  async function handleInquiry(e) {
    e.preventDefault()
    setSending(true); setSendErr('')
    const { error } = await supabase.from('inquiries').insert({
      property_id: id,
      name:    inquiry.name,
      email:   inquiry.email,
      phone:   inquiry.phone || null,
      message: inquiry.message,
    })
    if (error) { setSendErr('Failed to send. Please try again.'); setSending(false); return }
    setSent(true); setSending(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-cream pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const mainImage = images[activeImg]?.url ?? '/placeholder-property.jpg'
  const backPath  = property.listing_type === 'rent' ? '/rent' : '/buy'

  return (
    <div className="min-h-screen bg-cream pt-16">

      {/* ── Breadcrumb bar ── */}
      <div className="bg-forest py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/" className="text-white/60 hover:text-white transition-colors">Home</Link>
          <span className="text-white/30">/</span>
          <Link to={backPath} className="text-white/60 hover:text-white transition-colors capitalize">
            {property.listing_type === 'rent' ? 'Rent' : 'Buy'}
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/90 line-clamp-1">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-forest transition-colors mb-6"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ══ Left column — gallery + details ══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Main image */}
              <div className="relative aspect-[16/9] bg-gray-100">
                <img
                  src={mainImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${badgeStyles[property.badge] ?? 'bg-gray-700 text-white'}`}>
                    {property.badge}
                  </span>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <span className="absolute bottom-3 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                      {activeImg + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeImg ? 'border-forest' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + price */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin size={14} className="text-forest-mid shrink-0" />
                    <span>{property.location}{property.county ? `, ${property.county} County` : ''}</span>
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-forest whitespace-nowrap">
                  {formatPrice(property.price, property.listing_type, property.price_period)}
                </p>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {property.area_value && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Maximize2 size={16} className="text-forest shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Area</p>
                      <p className="text-sm font-semibold text-gray-700">{property.area_value} {property.area_unit}</p>
                    </div>
                  </div>
                )}
                {property.bedrooms != null && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Bed size={16} className="text-forest shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Bedrooms</p>
                      <p className="text-sm font-semibold text-gray-700">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Bath size={16} className="text-forest shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Bathrooms</p>
                      <p className="text-sm font-semibold text-gray-700">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                  <Home size={16} className="text-forest shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Type</p>
                    <p className="text-sm font-semibold text-gray-700 capitalize">{property.property_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                  <Tag size={16} className="text-forest shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Listing</p>
                    <p className="text-sm font-semibold text-gray-700 capitalize">{property.listing_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                  <Calendar size={16} className="text-forest shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Listed</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {new Date(property.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About This Property</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Features &amp; Amenities</h2>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={15} className="text-forest shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ══ Right column — inquiry form ══ */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Enquire About This Property</h2>
              <p className="text-sm text-gray-400 mb-5">We'll get back to you within 24 hours.</p>

              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={40} className="text-forest mx-auto mb-3" />
                  <p className="font-semibold text-gray-800">Inquiry Sent!</p>
                  <p className="text-sm text-gray-400 mt-1">Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-4">
                  {sendErr && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{sendErr}</p>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
                    <input
                      required
                      value={inquiry.name}
                      onChange={e => setInquiry(v => ({ ...v, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
                    <input
                      required type="email"
                      value={inquiry.email}
                      onChange={e => setInquiry(v => ({ ...v, email: e.target.value }))}
                      placeholder="you@email.com"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                    <input
                      value={inquiry.phone}
                      onChange={e => setInquiry(v => ({ ...v, phone: e.target.value }))}
                      placeholder="+254 7xx xxx xxx"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Message *</label>
                    <textarea
                      required rows={4}
                      value={inquiry.message}
                      onChange={e => setInquiry(v => ({ ...v, message: e.target.value }))}
                      placeholder={`I'm interested in "${property.title}"…`}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {sending
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                      : <><Mail size={15} /> Send Inquiry</>}
                  </button>
                </form>
              )}

              {/* Direct contact */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="tel:+254700000001"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest transition-colors"
                >
                  <Phone size={14} className="text-forest" /> +254 700 000 001
                </a>
                <a
                  href="mailto:info@heavenhearth.co.ke"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest transition-colors"
                >
                  <Mail size={14} className="text-forest" /> info@heavenhearth.co.ke
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
