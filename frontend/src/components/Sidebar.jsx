import { NavLink } from 'react-router-dom'
import { FiBarChart2, FiHome, FiInfo, FiWind } from 'react-icons/fi'

const links = [
  { to: '/', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/about', label: 'About', icon: FiInfo },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface p-4 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-primary to-accent text-white">
            <FiWind />
          </span>
          <span className="text-lg font-semibold">WindWatch</span>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-primary text-primary-fg' : 'text-fg hover:bg-raised'
                }`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}