import React, { useMemo, useState } from 'react'
import Home from './home.jsx'
import Report from './report.jsx'
import './theme.css'
import {
  useCascadeReadings,
  useLatestReading,
} from './hooks/useCascadeReadings'
import { useGeminiInsights } from './hooks/useGeminiInsights'
import generateFallbackRecommendations from './generateRecommendations.jsx.jsx'

const DEFAULT_DEVICE_ID = 'ESP32_01'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max)

const normalizePercent = (value) => {
  const numeric = toNumber(value)
  if (numeric === null) return null
  return clamp(numeric, 0, 100)
}

const normalizeMoisture = (value) => {
  const numeric = toNumber(value)
  if (numeric === null) return null
  return numeric > 1 ? normalizePercent(numeric) : normalizePercent(numeric * 100)
}

const normalizePestScore = (value) => {
  const numeric = toNumber(value)
  if (numeric === null) {
    return { ratio: null, percent: null }
  }

  const ratio = clamp(numeric > 1 ? numeric / 100 : numeric, 0, 1)
  const percent = clamp(ratio * 100, 0, 100)

  return { ratio, percent }
}

const buildSnapshot = (reading) => {
  if (!reading) {
    return {
      ndmi: 0,
      ndmiDisplay: '—',
      healthScore: 0,
      ph: '—',
      pestRisk: 0,
      pestPercent: null,
      moisture: 0,
      moisturePercent: null,
    }
  }

  const moisturePercent =
    normalizeMoisture(reading.moisture_pct ?? reading.moisturePct ?? reading.moisture) ?? 0
  const { ratio: pestRisk, percent: pestPercent } = normalizePestScore(
    reading.pestScore ?? reading.pest_score ?? reading.pestRisk
  )

  return {
    ndmi: moisturePercent / 100,
    ndmiDisplay: `${moisturePercent.toFixed(1)}%`,
    healthScore: reading.healthScore ?? moisturePercent,
    ph: reading.ph ?? 6.5,
    pestRisk: pestRisk ?? 0,
    pestPercent,
    moisture: moisturePercent,
    moisturePercent,
  }
}

const buildHistory = (items = []) =>
  items.map((item) => ({
    time: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString()
      : '',
    moisture:
      normalizeMoisture(item.moisture_pct ?? item.moisturePct ?? item.moisture) ?? 0,
    moisturePercent: normalizeMoisture(item.moisture_pct ?? item.moisturePct ?? item.moisture),
    pestRisk: normalizePestScore(item.pest_score ?? item.pestRisk).ratio ?? 0,
    pestPercent: normalizePestScore(item.pest_score ?? item.pestRisk).percent,
    healthScore: item.healthScore ?? item.health_score ?? 0,
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

  const moistureSeries = useMemo(
    () =>
      historyData
        .map((entry) => entry.moisturePercent)
        .filter((value) => value !== null && value !== undefined),
    [historyData]
  )

  const pestSeries = useMemo(
    () =>
      historyData
        .map((entry) => entry.pestPercent)
        .filter((value) => value !== null && value !== undefined),
    [historyData]
  )

  const {
    data: geminiInsights,
    isLoading: insightsLoading,
    isError: insightsError,
    error: insightsErrorObject,
  } = useGeminiInsights(
    snapshot.moisturePercent !== null
      ? {
          moisturePercent: snapshot.moisturePercent,
          pestPercent: snapshot.pestPercent,
          ph: snapshot.ph,
          recentMoisture: moistureSeries,
          recentPest: pestSeries,
        }
      : null,
    { enabled: showReport }
  )

  const recommendations = useMemo(() => {
    if (geminiInsights && geminiInsights.length) {
      return geminiInsights
    }
    return generateFallbackRecommendations({
      ndmi: snapshot.ndmi,
      healthScore: snapshot.healthScore,
      ph: snapshot.ph,
      pestRisk: snapshot.pestRisk,
      moisture: snapshot.moisturePercent ?? 0,
    })
  }, [geminiInsights, snapshot])

  const loading = latestLoading || readingsLoading

  return (
    <div className="app-container">
      {showReport ? (
        <Report
          snapshot={snapshot}
          historyData={historyData}
          onBack={() => setShowReport(false)}
          loading={loading || insightsLoading}
          insightsError={insightsError}
          insightsErrorMessage={insightsErrorObject?.message}
          recommendations={recommendations}
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
