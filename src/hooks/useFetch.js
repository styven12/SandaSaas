import { useEffect, useState } from 'react'

export function useFetch(request, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  useEffect(() => { let active = true; setState({ data: null, loading: true, error: null }); request().then((data) => active && setState({ data, loading: false, error: null })).catch((error) => active && setState({ data: null, loading: false, error })); return () => { active = false } }, dependencies)
  return state
}
