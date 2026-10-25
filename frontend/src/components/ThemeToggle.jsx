import { FiMoon, FiSun } from 'react-icons/fi'
import useTheme from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-fg transition hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  )
}