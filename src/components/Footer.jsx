import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Globe, Share2, Camera, Play } from 'lucide-react'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/buy', label: 'Buy Property' },
  { to: '/rent', label: 'Rent Property' },
]

const socials = [
  { Icon: Globe, href: '#', label: 'Website' },
  { Icon: Share2, href: '#', label: 'Share' },
  { Icon: Camera, href: '#', label: 'Instagram' },
  { Icon: Play, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold mb-3">
              Heaven<span className="text-gold">&amp;</span>Hearth
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Kenya's most trusted real estate platform — connecting buyers, sellers, and investors with verified properties across all 47 counties.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-forest transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-gold font-semibold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold font-semibold mb-5 text-sm uppercase tracking-wider">
              Our Services
            </h3>
            <ul className="space-y-3">
              {['Property Valuation', 'Legal Documentation', 'Land Survey', 'Investment Advisory', 'Property Management'].map((s) => (
                <li key={s}>
                  <span className="text-white/60 text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={16} className="shrink-0 mt-0.5 text-gold" />
                <span>Westlands Business Park, Waiyaki Way, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} className="shrink-0 text-gold" />
                <span>+254 700 000 001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} className="shrink-0 text-gold" />
                <span>info@heavenhearth.co.ke</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-4 text-center text-white/40 text-xs">
        &copy; {new Date().getFullYear()} Heaven &amp; Hearth Real Estate Ltd. Nairobi, Kenya. All rights reserved.
      </div>
    </footer>
  )
}
