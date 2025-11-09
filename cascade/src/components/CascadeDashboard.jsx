import React, { useMemo, useState } from 'react'
import {
  useCascadeReadings,
  useLatestReading,
} from '../hooks/useCascadeReadings'
import LatestReadingCard from './LatestReadingCard'
import ReadingsChart from './ReadingsChart'
import ReadingsTable from './ReadingsTable'
import TimeRangeSelector from './TimeRangeSelector'

const DEFAULT_DEVICE_ID = 'ESP32_01'

function CascadeDashboard() {
  const [deviceId] = useState(DEFAULT_DEVICE_ID)
  const [timeRange, setTimeRange] = useState({
    startTime: null,
    endTime: null,
  })

  const {
    data: latestReading,
    isLoading: latestLoading,
    error: latestError,
  } = useLatestReading(deviceId)

  const queryOptions = useMemo(() => {
    const opts = {
      limit: 100,
      sortOrder: 'desc',
    }

    if (timeRange.startTime && timeRange.endTime) {
      opts.startTime = timeRange.startTime
      opts.endTime = timeRange.endTime
    }

    return opts
  }, [timeRange])

  const {
    data: readingsData,
    isLoading: readingsLoading,
    error: readingsError,
    refetch: refetchReadings,
  } = useCascadeReadings(deviceId, queryOptions)

  const readings = readingsData?.items ?? []

  const handleRefresh = () => {
    refetchReadings()
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
  }

  if (latestError || readingsError) {
    return (
      <div className="cascade-dashboard">
        <header className="dashboard-header">
          <h1>ESP32 Cascade Readings Dashboard</h1>
        </header>
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{latestError?.message || readingsError?.message}</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cascade-dashboard">
      <header className="dashboard-header">
        <h1>ESP32 Cascade Readings Dashboard</h1>
        <div className="dashboard-controls">
          <button
            onClick={handleRefresh}
            disabled={readingsLoading}
            className="refresh-btn"
          >
            {readingsLoading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </header>

      <LatestReadingCard reading={latestReading} loading={latestLoading} />

      <TimeRangeSelector
        onRangeChange={handleTimeRangeChange}
        currentRange={timeRange}
      />

      <ReadingsChart readings={readings} loading={readingsLoading} />

      <ReadingsTable readings={readings} loading={readingsLoading} />
    </div>
  )
}

export default CascadeDashboard

