import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchGeminiInsights } from '../services/geminiInsights'

const serializeMetrics = (metrics) =>
  JSON.stringify(
    metrics,
    Object.keys(metrics ?? {}).sort(),
    0
  )

export const useGeminiInsights = (metrics, options = {}) => {
  const enabled = options.enabled ?? true
  const serialized = useMemo(
    () => (metrics ? serializeMetrics(metrics) : null),
    [metrics]
  )

  return useQuery({
    queryKey: ['gemini-insights', serialized],
    queryFn: () => fetchGeminiInsights(metrics),
    enabled: Boolean(enabled && metrics),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

