// Card with title + loading skeleton + empty state. The chart goes inside as children.
export default function ChartCard({ title, subtitle, loading, empty, height = 'h-72', className = '', children }) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      <div className="mt-4">
        {loading ? (
          <div className={`${height} animate-pulse rounded-xl bg-raised`} />
        ) : empty ? (
          <p className="py-16 text-center text-muted">No data to show.</p>
        ) : (
          <div className={`${height} w-full text-muted`}>{children}</div>
        )}
      </div>
    </section>
  )
}