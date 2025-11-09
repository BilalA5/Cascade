import {
  useQuery,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { dynamoDBService } from '../services/dynamodb'

export function useCascadeReadings(deviceId = 'ESP32_01', options = {}) {
  return useQuery({
    queryKey: ['cascadeReadings', deviceId, options],
    queryFn: () => dynamoDBService.getReadings(deviceId, options),
    refetchInterval: 60_000,
    enabled: Boolean(deviceId),
  })
}

export function useLatestReading(deviceId = 'ESP32_01') {
  return useQuery({
    queryKey: ['latestReading', deviceId],
    queryFn: () => dynamoDBService.getLatestReading(deviceId),
    refetchInterval: 30_000,
    enabled: Boolean(deviceId),
  })
}

export function useInfiniteReadings(deviceId = 'ESP32_01') {
  return useInfiniteQuery({
    queryKey: ['infiniteReadings', deviceId],
    queryFn: ({ pageParam = null }) =>
      dynamoDBService.getReadings(deviceId, {
        startKey: pageParam,
        limit: 25,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.lastEvaluatedKey || undefined,
    enabled: Boolean(deviceId),
  })
}

export function useReadingsInRange(deviceId, startTime, endTime) {
  return useQuery({
    queryKey: ['readingsRange', deviceId, startTime, endTime],
    queryFn: () =>
      dynamoDBService.getReadingsInRange(
        deviceId,
        startTime,
        endTime
      ),
    enabled:
      Boolean(deviceId) &&
      Boolean(startTime) &&
      Boolean(endTime),
  })
}

