import { FiRotateCcw } from 'react-icons/fi'

const inputCls = 'w-full rounded-lg border border-border-strong bg-bg px-2.5 py-1.5 text-sm text-fg'

function Field({ label, children }) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  )
}

export default function FilterBar({ filters, onChange, onReset, shown, total }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">Filters</h2>
          <p className="text-xs text-muted">
            Showing {shown.toLocaleString()} of {total.toLocaleString()} rows (applies to the chart and table)
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-border-strong px-3 py-1.5 text-sm hover:bg-raised"
        >
          <FiRotateCcw /> Reset filters
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Target date from">
          <input type="date" className={inputCls} value={filters.dateFrom} onChange={set('dateFrom')} />
        </Field>
        <Field label="Target date to">
          <input type="date" className={inputCls} value={filters.dateTo} onChange={set('dateTo')} />
        </Field>
        <Field label="Time of day from">
          <input type="time" className={inputCls} value={filters.timeFrom} onChange={set('timeFrom')} />
        </Field>
        <Field label="Time of day to">
          <input type="time" className={inputCls} value={filters.timeTo} onChange={set('timeTo')} />
        </Field>
        <Field label="Forecast min (MW)">
          <input type="number" min="0" placeholder="0" className={inputCls} value={filters.genMin} onChange={set('genMin')} />
        </Field>
        <Field label="Forecast max (MW)">
          <input type="number" min="0" placeholder="20000" className={inputCls} value={filters.genMax} onChange={set('genMax')} />
        </Field>
        <Field label="Published from">
          <input type="date" className={inputCls} value={filters.pubFrom} onChange={set('pubFrom')} />
        </Field>
        <Field label="Published to">
          <input type="date" className={inputCls} value={filters.pubTo} onChange={set('pubTo')} />
        </Field>
      </div>
    </section>
  )
}