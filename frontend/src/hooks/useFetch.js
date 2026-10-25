import { useCallback, useEffect, useState } from 'react'

// Runs an async function and tracks data / loading / error. retry() runs it again.
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetcher()
      .then(setData)
      .catch((e) => setError(e.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, retry: load }
}