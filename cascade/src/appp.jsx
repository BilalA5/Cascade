import React, { useMemo, useState } from 'react'
import Home from './home.jsx'
import Report from './report.jsx'
import './theme.css'
import {
  useCascadeReadings,
  useLatestReading,
} from './hooks/useCascadeReadings'

const DEFAULT_DEVICE_ID = 'ESP32_01'

const buildSnapshot = (reading) => {
  if (!reading) {
    return {
      ndmi: '—',
      healthScore: 0,
      ph: '—',
      pestRisk: 0,
      moisture: 0,
    }
  }

  const moistureValue = Number(
    reading.moisturePct ??
      reading.moisture ??
      0
  )

  const pestScoreRaw =
    reading.pestScore ?? 0
  const pestRisk =
    pestScoreRaw > 1
      ? pestScoreRaw / 100
      : pestScoreRaw

  return {
    ndmi: moistureValue.toFixed(1),
    healthScore:
      reading.healthScore ?? moistureValue,
    ph: reading.ph ?? 6.5,
    pestRisk,
    moisture: moistureValue,
  }
}

const buildHistory = (items = []) =>
  items.map((item) => ({
    time: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString()
      : '',
    moisture:
      item.moisturePct ??
      item.moisture ??
      0,
    healthScore: item.healthScore ?? 0,
  }))

export default function App() {
  const [showReport, setShowReport] = useState(false)
  const deviceId = DEFAULT_DEVICE_ID

  const {
    data: latest,
    isLoading: latestLoading,
  } = useLatestReading(deviceId)

  const {
    data: readingsData,
    isLoading: readingsLoading,
  } = useCascadeReadings(deviceId, {
    limit: 24,
    sortOrder: 'desc',
  })

  const snapshot = useMemo(
    () => buildSnapshot(latest),
    [latest]
  )

  const historyData = useMemo(
    () => buildHistory(readingsData?.items),
    [readingsData]
  )

  const loading = latestLoading || readingsLoading

  return (
    <div className="app-container">
      {showReport ? (
        <Report
          snapshot={snapshot}
          historyData={historyData}
          onBack={() => setShowReport(false)}
          loading={loading}
        />
      ) : (
        <Home
          latestSnapshot={snapshot}
          onGenerate={() => setShowReport(true)}
          loading={loading}
        />
      )}
    </div>
  )
}
