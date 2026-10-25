import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtDay, fmtMW } from '../../utils/format'
import { axisProps, COLORS, gridProps, kFormat, legendProps, tooltipProps } from './chartTheme'

export default function DailyBarChart({ data }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="day" tickFormatter={fmtDay} minTickGap={24} {...axisProps} />
        <YAxis tickFormatter={kFormat} width={44} {...axisProps} />
        <Tooltip
          labelFormatter={fmtDay}
          formatter={(v, name) => [fmtMW(v), name]}
          cursor={{ fill: 'currentColor', fillOpacity: 0.08 }}
          {...tooltipProps}
        />
        <Legend {...legendProps} />
        <Bar dataKey="forecast" name="Avg forecast" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
        <Bar dataKey="actual" name="Avg actual" fill={COLORS.green} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}