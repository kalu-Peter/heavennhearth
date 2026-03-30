import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, MapPin, ArrowRight,
  Shield, FileText, Globe, DollarSign,
  Home, Building2, Briefcase, Settings,
  Star, CheckCircle2,
} from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { landProperties, farmProperties, houseProperties } from '../data/properties'

/* ─── Data ─────────────────────────────────────────────────── */

const heroStats = [
  { value: '1,200+', label: 'Listings' },
  { value: '47', label: 'Counties' },
  { value: '98%', label: 'Verified' },
  { value: '3,400+', label: 'Clients' },
]

const cities = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Malindi', 'Nanyuki', 'Karen', 'Westlands', 'Ruiru', 'Kiambu',
  'Nyeri', 'Machakos', 'Athi River', 'Limuru', 'Kikuyu', 'Ruaka',
  'Ngong', 'Kitengela', 'Kilifi', 'Kisii', 'Meru', 'Embu',
]

const services = [
  {
    Icon: Home,
    title: 'Buy Property',
    desc: 'Find your dream home or apartment from our verified listings across every county in Kenya.',
  },
  {
    Icon: Building2,
    title: 'Buy Land',
    desc: 'Secure prime plots with clean title deeds in high-growth areas — from Nairobi to the Coast.',
  },
  {
    Icon: Briefcase,
    title: 'Sell With Us',
    desc: 'List your property and connect with thousands of qualified buyers. We handle the marketing.',
  },
  {
    Icon: Settings,
    title: 'Property Management',
    desc: 'Tenant sourcing, rent collection, and maintenance — we manage your investment so you don\'t have to.',
  },
]

const whyUs = [
  {
    Icon: Shield,
    title: 'Verified Listings',
    desc: 'Every property undergoes a rigorous verification process before it appears on our platform.',
  },
  {
    Icon: FileText,
    title: 'Full Legal Support',
    desc: 'We guide you through title deed transfers, sale agreements, and all legal documentation.',
  },
  {
    Icon: Globe,
    title: 'Nationwide Coverage',
    desc: 'Listings from all 47 counties — from Nairobi CBD to coastal Kilifi and rural Kisii.',
  },
  {
    Icon: DollarSign,
    title: 'Transparent Pricing',
    desc: 'No hidden charges. The price you see is exactly what you pay — guaranteed.',
  },
]

const testimonials = [
  {
    name: 'Grace Wanjiku',
    role: 'Land Buyer, Kiambu',
    text: 'I found my dream plot in Ruaka through Heaven & Hearth. The process was transparent, fast, and the agent was incredibly helpful from start to finish.',
    initials: 'GW',
  },
  {
    name: 'James Odhiambo',
    role: 'Farm Tenant, Nyeri',
    text: 'Renting the coffee farm was seamless. All documents were in order and the team guided me through every step of the agreement process.',
    initials: 'JO',
  },
  {
    name: 'Aisha Mwangi',
    role: 'Home Buyer, Nairobi',
    text: 'Best real estate experience I\'ve ever had in Kenya. They truly listen to your needs and always deliver exactly what you\'re looking for.',
    initials: 'AM',
  },
]

/* ─── Component ─────────────────────────────────────────────── */

export default function HomePage() {
  const [tab, setTab] = useState('Buy')
  const [filter, setFilter] = useState('All')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('All Types')
  const [budget, setBudget] = useState('Any Budget')
  const [size, setSize] = useState('')

  const allFeatured = [...landProperties, ...houseProperties, ...farmProperties]
  const featured = (() => {
    if (filter === 'Land')  return landProperties
    if (filter === 'House') return houseProperties
    if (filter === 'Farm')  return farmProperties
    return allFeatured
  })().slice(0, 6)

  return (
    <div className="pt-16">

      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-gray-950">
        {/*
          Background image — add your own photo to /public/hero-bg.jpg
          It will show automatically once the file is present.
        */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-14 items-center w-full">

          {/* ── Left: headline + stats ── */}
          <div>
            <span className="inline-block bg-gold/20 text-gold text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              Kenya's Most Trusted Real Estate Platform
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-5">
              Discover Prime Land{' '}
              <span className="text-gold">&amp;</span>{' '}
              Property Across{' '}
              <span className="text-gold">Kenya</span>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              Browse 1,200+ verified listings across all 47 counties — from prime Nairobi plots to coastal villas and fertile farmlands.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/buy"
                className="inline-flex items-center gap-2 bg-gold text-forest font-bold px-7 py-3.5 rounded-xl hover:bg-gold-light transition-colors shadow-lg"
              >
                Browse Listings <ArrowRight size={18} />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {heroStats.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                >
                  <p className="text-2xl font-extrabold text-gold">{value}</p>
                  <p className="text-white/55 text-xs font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: search card ── */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-auto lg:mx-0">
            <h3 className="text-forest font-extrabold text-lg mb-4">Find Your Property</h3>

            {/* Buy / Rent / Sell tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              {['Buy', 'Rent', 'Sell'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    tab === t
                      ? 'bg-forest text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Location
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-forest transition-colors">
                <MapPin size={15} className="text-forest-mid shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Nairobi, Mombasa, Kisumu..."
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                />
              </div>
            </div>

            {/* Property type */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-forest transition-colors bg-white"
              >
                <option>All Types</option>
                <option>Land / Plot</option>
                <option>House / Villa</option>
                <option>Apartment</option>
                <option>Farm</option>
                <option>Commercial</option>
              </select>
            </div>

            {/* Budget */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-forest transition-colors bg-white"
              >
                <option>Any Budget</option>
                <option>Under KES 1M</option>
                <option>KES 1M – 5M</option>
                <option>KES 5M – 15M</option>
                <option>KES 15M – 50M</option>
                <option>KES 50M+</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Size / Area
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 50×100, 1/4 acre, 3 bedrooms"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-forest transition-colors"
              />
            </div>

            <button className="w-full bg-forest text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-forest-light transition-colors">
              <Search size={18} /> Search Properties
            </button>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          MARQUEE — Kenyan cities
      ════════════════════════════════════════════════ */}
      <div className="bg-forest py-3.5 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 40s linear infinite' }}
        >
          {[...cities, ...cities].map((city, i) => (
            <span
              key={i}
              className="inline-flex items-center text-white/75 font-medium text-sm px-5"
            >
              {city}
              <span className="text-gold ml-5 text-xs">&#x2022;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          FEATURED LISTINGS
      ════════════════════════════════════════════════ */}
      <section className="py-20 bg-white" id="listings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-gold font-semibold text-xs uppercase tracking-widest">
                Handpicked for You
              </span>
              <h2 className="text-4xl font-extrabold text-forest mt-1">Featured Listings</h2>
            </div>
            <Link
              to="/buy"
              className="text-forest font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all shrink-0"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {['All', 'Land', 'House', 'Farm'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  filter === f
                    ? 'bg-forest text-white border-forest'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-forest hover:text-forest'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-900" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <span className="text-gold font-semibold text-xs uppercase tracking-widest">What We Do</span>
            <h2 className="text-4xl font-extrabold text-white mt-2 mb-3">Our Services</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              Comprehensive real estate services to help you buy, sell, or manage property anywhere in Kenya.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-gray-800 rounded-2xl p-7 hover:bg-forest transition-colors duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/15 transition-colors">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white/75 transition-colors">
                  {desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WHY CHOOSE US
      ════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">

          {/* Visual side */}
          <div className="relative">
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-forest to-forest-mid rounded-3xl overflow-hidden flex items-center justify-center">
              {/* Decorative pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <span className="text-[100px] leading-none opacity-10 select-none">&#x2302;</span>
            </div>

            {/* 98% satisfaction badge */}
            <div className="absolute bottom-6 left-6 bg-gold rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-5xl font-extrabold text-forest leading-none">98%</p>
              <p className="text-forest/80 text-sm font-semibold mt-1">Client Satisfaction</p>
            </div>

            {/* Years badge */}
            <div className="absolute top-6 right-6 bg-white rounded-xl px-4 py-3 shadow-lg text-center border border-gray-100">
              <p className="text-2xl font-extrabold text-forest leading-none">12+</p>
              <p className="text-gray-500 text-xs mt-0.5">Years in Kenya</p>
            </div>
          </div>

          {/* Text side */}
          <div>
            <span className="text-gold font-semibold text-xs uppercase tracking-widest">Our Promise</span>
            <h2 className="text-4xl font-extrabold text-forest mt-2 mb-3">Why Kenyans Trust Us</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              We combine deep local market expertise with professional service standards to ensure every transaction is safe, transparent, and successful.
            </p>
            <div className="space-y-5">
              {whyUs.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-forest/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={20} className="text-forest" />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════ */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <span className="text-gold font-semibold text-xs uppercase tracking-widest">Client Stories</span>
            <h2 className="text-4xl font-extrabold text-forest mt-2">What Our Clients Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, initials }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 text-gold mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed italic flex-1 mb-5">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-forest text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════ */}
      <section className="bg-forest py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-white/80 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Get Started Today
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Buy, Sell or<br className="hidden sm:block" /> Invest in Kenya?
          </h2>
          <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join 3,400+ Kenyans who have found their perfect property through Heaven &amp; Hearth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/buy"
              className="inline-flex items-center gap-2 bg-gold text-forest font-bold px-8 py-3.5 rounded-xl hover:bg-gold-light transition-colors shadow-lg"
            >
              <Search size={18} /> Browse Listings
            </Link>
            <button className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl border border-white/25 hover:bg-white/20 transition-colors">
              List Property <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
