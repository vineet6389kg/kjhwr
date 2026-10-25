import axios from 'axios'

// Clean up the configured API address:
//  - add https:// if it was forgotten (a bare "x.vercel.app" would be treated as a relative path)
//  - remove trailing slashes, so we never produce "//comparison"
const raw = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').trim()
const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`
const API_URL = withProtocol.replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000,
})

// Axios treats any 200 reply as success, even an HTML page. These checks turn a
// wrong response into a clear error that the ErrorState screen can show.
const BAD_RESPONSE = 'The API returned an unexpected response. Check the VITE_API_URL setting.'

const expectList = (data) => {
  if (!Array.isArray(data)) throw new Error(BAD_RESPONSE)
  return data
}

const expectObject = (data) => {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) throw new Error(BAD_RESPONSE)
  return data
}

export const getMetrics = (decisionHour = 12) =>
  api.get('/metrics', { params: { decisionHour } }).then((r) => expectObject(r.data))

export const getLatest = (decisionHour = 12) =>
  api.get('/latest', { params: { decisionHour } }).then((r) => expectObject(r.data))

export const getComparison = (decisionHour = 12) =>
  api.get('/comparison', { params: { decisionHour } }).then((r) => expectList(r.data))