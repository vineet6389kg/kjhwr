import { FiMenu } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-bg/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface lg:hidden"
        >
          <FiMenu />
        </button>
        <div>
          <p className="text-sm font-medium">UK Wind Forecast Analytics</p>
          <p className="hidden text-xs text-muted sm:block">
            Day-ahead purchase decisions · January 2026
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}