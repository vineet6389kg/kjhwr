import { Link } from 'react-router-dom'
import { FiCompass } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="grid place-items-center rounded-2xl border border-border bg-surface p-10 text-center">
      <FiCompass className="mb-3 text-3xl text-primary-text" />
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="mt-1 max-w-md text-sm text-muted">
        The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-fg transition hover:bg-primary-hover"
      >
        Back to dashboard
      </Link>
    </div>
  )
}