// Turns rows into a CSV file and triggers a browser download
export function downloadCSV(rows, filename = 'export.csv') {
  const header = ['startTime', 'publishTime', 'forecastGeneration', 'actualGeneration', 'error']
  const lines = rows.map((r) => header.map((k) => r[k]).join(','))
  const csv = [header.join(','), ...lines].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}