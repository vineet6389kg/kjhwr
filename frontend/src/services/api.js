import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 120000, // first backend call downloads data from Elexon, so allow time
})

export const getMetrics = (decisionHour = 12) =>
  api.get('/metrics', { params: { decisionHour } }).then((r) => r.data)

export const getLatest = (decisionHour = 12) =>
  api.get('/latest', { params: { decisionHour } }).then((r) => r.data)

export const getComparison = (decisionHour = 12) =>
  api.get('/comparison', { params: { decisionHour } }).then((r) => r.data)