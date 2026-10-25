import { useMemo, useState } from 'react'
import { FiActivity, FiAlertCircle, FiTarget, FiTrendingUp } from 'react-icons/fi'
import useFetch from '../hooks/useFetch'
import { getComparison, getLatest, getMetrics } from '../services/api'
import { useDecisionHour } from '../context/DecisionHourContext'
import { applyFilters, EMPTY_FILTERS } from '../utils/filters'
import { fmtDateTime, fmtMW, fmtPct } from '../utils/format'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import ChartCard from '../components/ChartCard'
import DecisionHourSelect from '../components/DecisionHourSelect'
import FilterBar from '../components/FilterBar'
import DataTable from '../components/DataTable'
import ForecastChart from '../components/charts/ForecastChart'

export default function Dashboard() {
  const { hour } = useDecisionHour()
  const metrics = useFetch(() => getMetrics(hour), [hour])
  const latest = useFetch(() => getLatest(hour), [hour])
  const comparison = useFetch(() => getComparison(hour), [hour])

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const all = comparison.data ?? []
  const filtered = useMemo(() => applyFilters(all, filters), [all, filters])

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
        <DecisionHourSelect />
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
      <p className="-mt-3 text-xs text-muted">Cards above cover the whole of January 2026. Filters below apply to the chart and table.</p>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
        shown={filtered.length}
        total={all.length}
      />

      <ChartCard title="Forecast vs Actual" height="h-80" loading={comparison.loading} empty={!filtered.length}>
        <ForecastChart data={filtered} />
      </ChartCard>

      <DataTable rows={filtered} loading={comparison.loading} />
    </div>
  )
}