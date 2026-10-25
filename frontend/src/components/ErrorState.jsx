import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-border bg-surface p-10 text-center">
      <FiAlertTriangle className="mb-3 text-3xl text-error" />
      <p className="font-medium">Couldn't load data</p>
      <p className="mt-1 max-w-md text-sm text-muted">
        {message}. Check that the backend is running.
      </p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-fg transition hover:bg-primary-hover"
      >
        <FiRefreshCw /> Retry
      </button>
    </div>
  )
}