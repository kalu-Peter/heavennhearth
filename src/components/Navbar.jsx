import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/',      label: 'Home' },
  { to: '/buy',   label: 'Buy' },
  { to: '/rent',  label: 'Rent' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-forest shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-2 md:grid-cols-3 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/hhr.jpeg"
            alt="Heaven & Hearth Realty"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden md:flex items-center justify-center gap-7">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? 'text-gold border-b-2 border-gold pb-0.5'
                    : 'text-white/80 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
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
                `py-3 px-2 text-base font-medium border-b border-white/10 ${
                  isActive ? 'text-gold' : 'text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
