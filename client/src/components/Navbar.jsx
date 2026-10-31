import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Person', href: '/person' },
]

// Liquid glass surfaces (see the liquid-glass utility in index.css)
const glass = 'liquid-glass'
const glassLens =
  'bg-white/80 text-gray-900 shadow-[inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(99,102,241,0.12),0_2px_10px_rgba(31,38,135,0.15)] ring-1 ring-white/80'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 px-3 pt-3">
      <nav
        className={`relative mx-auto flex max-w-5xl items-center justify-between rounded-full py-2 pr-2 pl-3 ${glass}`}
      >
        <Link to="/" className="flex items-center px-2">
          <span className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-gray-800">Person</span>
              <span className="bg-linear-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                Crud
              </span>
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
              Manage People
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 rounded-full bg-gray-900/5 p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                end
                className={({ isActive }) =>
                  `block rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out ${
                    isActive
                      ? glassLens
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`rounded-full p-2 text-gray-800 transition-transform active:scale-90 md:hidden ${glassLens}`}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed top-3 right-3 bottom-3 z-50 flex w-64 flex-col rounded-3xl p-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${glass} ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[110%] opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-2 pb-3">
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={`rounded-full p-1.5 text-gray-800 transition-transform active:scale-90 ${glassLens}`}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 font-medium transition-all duration-300 ${
                    isActive
                      ? glassLens
                      : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </header>
  )
}

export default Navbar
