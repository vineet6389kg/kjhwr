import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { fmtDateTime, fmtDay, fmtMW } from '../utils/format'

const COLORS = { forecast: '#3b82f6', actual: '#10b981' } // blue / emerald, readable in both themes

export default function ForecastChart({ data }) {
  // text-muted on the wrapper: axis text and grid use currentColor, so they follow the theme
  return (
    <div className="h-80 w-full text-muted">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.2} vertical={false} />
          <XAxis
            dataKey="startTime"
            tickFormatter={fmtDay}
            minTickGap={48}
            tick={{ fill: 'currentColor', fontSize: 12 }}
            stroke="currentColor"
          />
          <YAxis
            tickFormatter={(v) => `${v / 1000}k`}
            tick={{ fill: 'currentColor', fontSize: 12 }}
            stroke="currentColor"
            width={44}
          />
          <Tooltip
            labelFormatter={fmtDateTime}
            formatter={(v, name) => [fmtMW(v), name]}
            contentStyle={{
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border-strong)',
              borderRadius: 12,
              color: 'var(--c-fg)',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="forecastGeneration" name="Forecast" stroke={COLORS.forecast} dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="actualGeneration" name="Actual" stroke={COLORS.actual} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}