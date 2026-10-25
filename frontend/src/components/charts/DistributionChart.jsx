import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BIN_SIZE } from '../../utils/stats'
import { axisProps, COLORS, gridProps, kFormat, tooltipProps } from './chartTheme'

export default function DistributionChart({ data }) {
  const range = (bin) => `${bin.toLocaleString()} to ${(bin + BIN_SIZE).toLocaleString()} MW`
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="bin" tickFormatter={kFormat} minTickGap={16} {...axisProps} />
        <YAxis width={36} {...axisProps} />
        <Tooltip
          labelFormatter={range}
          formatter={(v) => [`${v} hours`, 'Count']}
          cursor={{ fill: 'currentColor', fillOpacity: 0.08 }}
          {...tooltipProps}
        />
        <ReferenceLine x={0} stroke="currentColor" strokeOpacity={0.6} />
        <Bar dataKey="count" name="Hours" fill={COLORS.blue} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}