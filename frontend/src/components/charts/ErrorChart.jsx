import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtDateTime, fmtDay, fmtMW } from '../../utils/format'
import { axisProps, COLORS, gridProps, kFormat, tooltipProps } from './chartTheme'

export default function ErrorChart({ data }) {
  return (
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="startTime" tickFormatter={fmtDay} minTickGap={48} {...axisProps} />
        <YAxis tickFormatter={kFormat} width={44} {...axisProps} />
        <Tooltip labelFormatter={fmtDateTime} formatter={(v) => [fmtMW(v), 'Error']} {...tooltipProps} />
        <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.6} />
        <Area type="monotone" dataKey="error" name="Error" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.25} strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  )
}