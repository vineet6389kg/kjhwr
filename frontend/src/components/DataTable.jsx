import { useMemo, useState } from 'react'
import { FiChevronDown, FiChevronUp, FiDownload, FiSearch } from 'react-icons/fi'
import { downloadCSV } from '../utils/csv'
import { fmtDateTime } from '../utils/format'

const num = (v) => Math.round(v).toLocaleString('en-GB')
const signed = (v) => `${v > 0 ? '+' : ''}${num(v)}`

const COLUMNS = [
  { key: 'startTime', label: 'Start time', render: fmtDateTime },
  { key: 'publishTime', label: 'Publish time', render: fmtDateTime },
  { key: 'forecastGeneration', label: 'Forecast (MW)', render: num, right: true },
  { key: 'actualGeneration', label: 'Actual (MW)', render: num, right: true },
  { key: 'error', label: 'Error (MW)', render: signed, right: true },
]

export default function DataTable({ rows, loading }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: 'startTime', dir: 'asc' })
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  // search -> sort (recomputed only when inputs change)
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q
      ? rows.filter((r) =>
          `${fmtDateTime(r.startTime)} ${fmtDateTime(r.publishTime)} ${r.forecastGeneration} ${r.actualGeneration} ${r.error}`
            .toLowerCase()
            .includes(q)
        )
      : rows
    const sign = sort.dir === 'asc' ? 1 : -1
    // ISO date text and numbers both compare correctly with < and >
    return [...matched].sort((a, b) => (a[sort.key] < b[sort.key] ? -sign : a[sort.key] > b[sort.key] ? sign : 0))
  }, [rows, query, sort])

  const pages = Math.max(1, Math.ceil(visible.length / pageSize))
  const current = Math.min(page, pages - 1) // protects against filters shrinking the data
  const pageRows = visible.slice(current * pageSize, (current + 1) * pageSize)

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Forecast vs actual data</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0) }}
              placeholder="Search e.g. 05 Jan or 12000"
              aria-label="Search table"
              className="w-60 rounded-xl border border-border-strong bg-bg py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <button
            onClick={() => downloadCSV(visible, 'wind-forecast-comparison.csv')}
            disabled={!visible.length}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-fg transition hover:bg-primary-hover disabled:opacity-50"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-strong text-left text-muted">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className={`px-3 py-2 font-medium ${c.right ? 'text-right' : ''}`}
                >
                  <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-fg">
                    {c.label}
                    {sort.key === c.key && (sort.dir === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={COLUMNS.length} className="px-3 py-2">
                      <div className="h-5 animate-pulse rounded bg-raised" />
                    </td>
                  </tr>
                ))
              : pageRows.map((r) => (
                  <tr key={r.startTime} className="border-b border-border hover:bg-raised/60">
                    {COLUMNS.map((c) => (
                      <td
                        key={c.key}
                        className={`whitespace-nowrap px-3 py-2 ${c.right ? 'text-right tabular-nums' : ''} ${
                          c.key === 'error' ? (r.error > 0 ? 'text-primary-text' : 'text-accent-text') : ''
                        }`}
                      >
                        {c.render(r[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && !visible.length && (
          <p className="py-12 text-center text-muted">No rows match your search and filters.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>{visible.length.toLocaleString()} rows</span>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0) }}
            aria-label="Rows per page"
            className="rounded-lg border border-border-strong bg-bg px-2 py-1 text-fg"
          >
            {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <button onClick={() => setPage(current - 1)} disabled={current === 0} className="rounded-lg border border-border-strong px-3 py-1 text-fg disabled:opacity-40">
            Prev
          </button>
          <span>Page {current + 1} of {pages}</span>
          <button onClick={() => setPage(current + 1)} disabled={current >= pages - 1} className="rounded-lg border border-border-strong px-3 py-1 text-fg disabled:opacity-40">
            Next
          </button>
        </div>
      </div>
    </section>
  )
}