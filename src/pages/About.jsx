import { Link } from 'react-router-dom'
import { Shield, FileText, Globe, DollarSign, ArrowRight } from 'lucide-react'

const values = [
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

export default function About() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-forest pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            About Heaven &amp; Hearth Realty
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl">
            Your trusted partner in land surveying &amp; real estate across Kenya.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <span className="text-gold font-semibold text-xs uppercase tracking-widest">Who We Are</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-forest mt-2 mb-5">Our Story</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Heaven &amp; Hearth Realty connects buyers, sellers, and investors with verified land and
          property across Kenya. From boundary identification and subdivision to full property
          sales, we handle the details so you can move forward with confidence.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Based in Kwale, we work with clients across all 47 counties — offering clean title deeds,
          transparent pricing, and hands-on support at every step of the process.
        </p>
      </div>

      {/* Values */}
      <div className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold font-semibold text-xs uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">What Sets Us Apart</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-gray-800 rounded-2xl p-7">
                <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center mb-5">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-forest py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Ready to Find Your Property?
          </h2>
          <p className="text-white/70 mb-8">
            Browse our listings or get in touch — our team is ready to help.
          </p>
          <Link
            to="/buy"
            className="inline-flex items-center gap-2 bg-gold text-forest font-bold px-7 py-3.5 rounded-xl hover:bg-gold-light transition-colors shadow-lg"
          >
            Browse Listings <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
