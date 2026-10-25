import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { COLORS, legendProps, tooltipProps } from './chartTheme'

export default function ErrorPieChart({ over, under }) {
  const total = over + under || 1
  const pct = (n) => Math.round((n / total) * 100)
  const data = [
    { name: `Over-forecast (${pct(over)}%)`, value: over, color: COLORS.blue },
    { name: `Under-forecast (${pct(under)}%)`, value: under, color: COLORS.green },
  ]

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2} stroke="none">
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Pie>
        <Tooltip formatter={(v) => [`${v.toLocaleString()} hours`]} {...tooltipProps} />
        <Legend {...legendProps} />
      </PieChart>
    </ResponsiveContainer>
  )
}