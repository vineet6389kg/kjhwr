export const BIN_SIZE = 500 // MW per histogram bar

// Average forecast and actual for each day (like pandas: df.groupby("day").mean())
export function dailyAverages(rows) {
  const days = {} // { "2026-01-05": { sumF, sumA, n } }
  for (const r of rows) {
    const day = r.startTime.slice(0, 10) // "2026-01-05T14:30:00Z" -> "2026-01-05"
    days[day] ??= { sumF: 0, sumA: 0, n: 0 }
    days[day].sumF += r.forecastGeneration
    days[day].sumA += r.actualGeneration
    days[day].n += 1
  }
  return Object.entries(days)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, d]) => ({ day, forecast: d.sumF / d.n, actual: d.sumA / d.n }))
}

// How many hours over-forecast, under-forecast, or exact
export function errorSplit(rows) {
  const over = rows.filter((r) => r.error > 0).length
  const under = rows.filter((r) => r.error < 0).length
  return { over, under, exact: rows.length - over - under }
}

// Count errors per 500 MW bucket (like pandas: pd.cut + value_counts)
export function errorHistogram(rows) {
  const bins = {}
  for (const r of rows) {
    const bin = Math.floor(r.error / BIN_SIZE) * BIN_SIZE // 1234 -> 1000, -120 -> -500
    bins[bin] = (bins[bin] || 0) + 1
  }
  return Object.entries(bins)
    .map(([bin, count]) => ({ bin: Number(bin), count }))
    .sort((a, b) => a.bin - b.bin)
}