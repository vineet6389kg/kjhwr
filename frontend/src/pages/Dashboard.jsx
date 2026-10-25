import { useState } from 'react'
import { FiActivity, FiAlertCircle, FiTarget, FiTrendingUp } from 'react-icons/fi'
import useFetch from '../hooks/useFetch'
import { getComparison, getLatest, getMetrics } from '../services/api'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import ForecastChart from '../components/ForecastChart'
import { fmtDateTime, fmtMW, fmtPct } from '../utils/format'

const HOURS = [6, 8, 10, 12, 14, 16]

export default function Dashboard() {
  const [hour, setHour] = useState(12) // assumed decision time (UTC) on the day before delivery
  const metrics = useFetch(() => getMetrics(hour), [hour])
  const latest = useFetch(() => getLatest(hour), [hour])
  const comparison = useFetch(() => getComparison(hour), [hour])

  const m = metrics.data
  const l = latest.data
  const error = metrics.error || latest.error || comparison.error
  const retryAll = () => { metrics.retry(); latest.retry(); comparison.retry() }

  if (error) return <ErrorState message={error} onRetry={retryAll} />

  const accuracy = m?.mape != null ? Math.max(0, 100 - m.mape) : null
  const biasText = m ? (m.bias > 0 ? 'Over-forecasting: risk of under-buying' : 'Under-forecasting: risk of over-buying') : ''
  const time = l?.startTime ? fmtDateTime(l.startTime) : ''

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted">Wind forecast available at decision time vs actual generation</p>
        </div>
        <label className="text-sm">
          <span className="mb-1 block text-muted">Decision time (day before, UTC)</span>
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="rounded-xl border border-border-strong bg-surface px-3 py-2"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Latest Forecast" value={fmtMW(l?.forecastGeneration)} hint={time} icon={FiTrendingUp} loading={latest.loading} />
        <StatCard label="Latest Actual" value={fmtMW(l?.actualGeneration)} hint={time} icon={FiActivity} loading={latest.loading} />
        <StatCard label="Forecast Error" value={fmtMW(l?.error)} hint="Forecast − actual" icon={FiAlertCircle} loading={latest.loading} />
        <StatCard label="Forecast Accuracy" value={fmtPct(accuracy)} hint="100 − MAPE" icon={FiTarget} loading={metrics.loading} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MAE" value={fmtMW(m?.mae)} hint="Average error size" loading={metrics.loading} />
        <StatCard label="RMSE" value={fmtMW(m?.rmse)} hint="Penalises large misses" loading={metrics.loading} />
        <StatCard label="MAPE" value={fmtPct(m?.mape)} hint="Error as % of actual" loading={metrics.loading} />
        <StatCard label="Bias" value={fmtMW(m?.bias)} hint={biasText} loading={metrics.loading} />
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="mb-4 font-semibold">Forecast vs Actual</h2>
        {comparison.loading ? (
          <div className="h-80 animate-pulse rounded-xl bg-raised" />
        ) : comparison.data?.length ? (
          <ForecastChart data={comparison.data} />
        ) : (
          <p className="py-16 text-center text-muted">No data for this decision time.</p>
        )}
      </section>
    </div>
  )
}