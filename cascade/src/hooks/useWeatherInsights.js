import { useQuery } from '@tanstack/react-query'
import { fetchCurrentWeather, fetchForecast } from '../services/weather'

export const useCurrentWeather = (options = {}) =>
  useQuery({
    queryKey: ['weather', 'current', options],
    queryFn: () => fetchCurrentWeather(options.parameters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: options.enabled ?? true,
  })

export const useWeatherForecast = (options = {}) =>
  useQuery({
    queryKey: ['weather', 'forecast', options],
    queryFn: () => fetchForecast(options.parameters),
    staleTime: 30 * 60 * 1000,
    retry: 1,
    enabled: options.enabled ?? true,
  })

