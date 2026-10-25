// Shared Recharts styling so every chart looks the same and follows light/dark mode.
export const COLORS = { blue: '#3b82f6', green: '#10b981' }

// 'currentColor' = the colour of the wrapper (text-muted), which changes with the theme
export const axisProps = { tick: { fill: 'currentColor', fontSize: 12 }, stroke: 'currentColor' }
export const gridProps = { stroke: 'currentColor', strokeOpacity: 0.2, vertical: false }

export const tooltipProps = {
  contentStyle: {
    background: 'var(--c-surface)',
    border: '1px solid var(--c-border-strong)',
    borderRadius: 12,
    color: 'var(--c-fg)',
  },
}

export const legendProps = {
  formatter: (value) => <span style={{ color: 'var(--c-fg)' }}>{value}</span>,
}

export const kFormat = (v) => `${v / 1000}k`