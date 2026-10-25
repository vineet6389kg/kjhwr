export const fmtMW = (v) =>
  v == null ? '—' : `${Math.round(v).toLocaleString('en-GB')} MW`

export const fmtPct = (v) => (v == null ? '—' : `${v.toFixed(1)}%`)

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC'

export const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' })