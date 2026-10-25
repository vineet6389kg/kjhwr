import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtDateTime, fmtDay, fmtMW } from '../../utils/format'
import { axisProps, COLORS, gridProps, kFormat, legendProps, tooltipProps } from './chartTheme'

export default function ForecastChart({ data }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="startTime" tickFormatter={fmtDay} minTickGap={48} {...axisProps} />
        <YAxis tickFormatter={kFormat} width={44} {...axisProps} />
        <Tooltip labelFormatter={fmtDateTime} formatter={(v, name) => [fmtMW(v), name]} {...tooltipProps} />
        <Legend {...legendProps} />
        <Line type="monotone" dataKey="forecastGeneration" name="Forecast" stroke={COLORS.blue} dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="actualGeneration" name="Actual" stroke={COLORS.green} dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}