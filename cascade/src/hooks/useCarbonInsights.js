import { useQuery } from '@tanstack/react-query'
import {
  fetchIrrigationCarbonEstimate,
  fetchLatestProjects,
} from '../services/carbon'

export const useCarbonEstimate = (options = {}) =>
  useQuery({
    queryKey: ['carbon', 'estimate', options],
    queryFn: () => fetchIrrigationCarbonEstimate(options),
    staleTime: 10 * 60 * 1000,
    retry: 1,
    enabled: options.enabled ?? true,
  })

export const useCarbonProjects = (options = {}) =>
  useQuery({
    queryKey: ['carbon', 'projects'],
    queryFn: fetchLatestProjects,
    staleTime: 60 * 60 * 1000,
    retry: 1,
    enabled: options.enabled ?? true,
  })

