export const EMPTY_FILTERS = {
  dateFrom: '', dateTo: '',       // target date, "2026-01-05"
  timeFrom: '', timeTo: '',       // target time of day, "06:00"
  genMin: '', genMax: '',         // forecast generation range (MW)
  pubFrom: '', pubTo: '',         // forecast publish date
}

// Keep only rows that match every filter that has been filled in
export function applyFilters(rows, f) {
  return rows.filter((r) => {
    const date = r.startTime.slice(0, 10)   // "2026-01-05"
    const time = r.startTime.slice(11, 16)  // "14:30"
    const pub = r.publishTime.slice(0, 10)

    // ISO dates and HH:MM times sort correctly as plain text, so < and > just work
    if (f.dateFrom && date < f.dateFrom) return false
    if (f.dateTo && date > f.dateTo) return false
    if (f.timeFrom && time < f.timeFrom) return false
    if (f.timeTo && time > f.timeTo) return false
    if (f.pubFrom && pub < f.pubFrom) return false
    if (f.pubTo && pub > f.pubTo) return false
    if (f.genMin !== '' && r.forecastGeneration < Number(f.genMin)) return false
    if (f.genMax !== '' && r.forecastGeneration > Number(f.genMax)) return false
    return true
  })
}