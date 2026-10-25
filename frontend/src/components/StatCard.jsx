export default function StatCard({ label, value, hint, icon: Icon, loading }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        {Icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary-text">
            <Icon />
          </span>
        )}
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-28 animate-pulse rounded bg-raised" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      )}
      {hint && !loading && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}