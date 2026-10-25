import { useMemo } from 'react'
import useFetch from '../hooks/useFetch'
import { getComparison } from '../services/api'
import { useDecisionHour } from '../context/DecisionHourContext'
import { dailyAverages, errorHistogram, errorSplit } from '../utils/stats'
import ChartCard from '../components/ChartCard'
import DecisionHourSelect from '../components/DecisionHourSelect'
import ErrorState from '../components/ErrorState'
import ErrorChart from '../components/charts/ErrorChart'
import DailyBarChart from '../components/charts/DailyBarChart'
import ErrorPieChart from '../components/charts/ErrorPieChart'
import DistributionChart from '../components/charts/DistributionChart'

export default function Analytics() {
  const { hour } = useDecisionHour()
  const { data, loading, error, retry } = useFetch(() => getComparison(hour), [hour])

  // useMemo = only recalculate when the data changes, not on every re-render
  const daily = useMemo(() => dailyAverages(data ?? []), [data])
  const split = useMemo(() => errorSplit(data ?? []), [data])
  const histogram = useMemo(() => errorHistogram(data ?? []), [data])

  if (error) return <ErrorState message={error} onRetry={retry} />
  const empty = !data?.length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted">How wrong, and in which direction, are the forecasts?</p>
        </div>
        <DecisionHourSelect />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          className="lg:col-span-2"
          title="Forecast error over time"
          subtitle="Forecast − actual. Above zero = over-forecast (risk of under-buying)."
          loading={loading}
          empty={empty}
        >
          <ErrorChart data={data} />
        </ChartCard>

        <ChartCard title="Daily average generation" subtitle="Mean of all hours in each day" loading={loading} empty={empty}>
          <DailyBarChart data={daily} />
        </ChartCard>

        <ChartCard title="Over vs under forecast" subtitle="Share of hours by error direction" loading={loading} empty={empty}>
          <ErrorPieChart over={split.over} under={split.under} />
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="Forecast error distribution"
          subtitle="Number of hours in each 500 MW error range"
          loading={loading}
          empty={empty}
        >
          <DistributionChart data={histogram} />
        </ChartCard>
      </div>
    </div>
  )
}