import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/buy-land', label: 'Buy Land' },
  { to: '/rent-farm', label: 'Rent Farm' },
  { to: '/sell-house', label: 'Sell House' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-forest shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl leading-none">&#x2302;</span>
          <span className="text-white font-bold text-xl tracking-tight">
            Heaven<span className="text-gold">&amp;</span>Hearth
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-gold border-b-2 border-gold pb-0.5'
                    : 'text-white/80 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button className="bg-gold text-forest text-sm font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors">
            List Property
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${
              open ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${
              open ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-forest-light px-4 py-4 flex flex-col gap-1 border-t border-white/10">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-3 px-2 text-sm font-medium border-b border-white/10 ${
                  isActive ? 'text-gold' : 'text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button className="mt-3 bg-gold text-forest text-sm font-bold px-4 py-2.5 rounded-lg w-full">
            List Property
          </button>
        </div>
      )}
    </nav>
  )
}
