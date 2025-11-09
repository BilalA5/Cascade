import React from 'react'

const formatNumber = (value, suffix = '') => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '—'
  }
  return `${Number(value).toFixed(1)}${suffix}`
}

function LatestReadingCard({ reading, loading }) {
  if (loading) {
    return (
      <div className="latest-reading-card loading">
        <div className="loading-spinner" />
        <p>Loading latest reading…</p>
      </div>
    )
  }

  if (!reading) {
    return (
      <div className="latest-reading-card no-data">
        <h3>No Data Available</h3>
        <p>No readings found for this device.</p>
      </div>
    )
  }

  const { timestamp, moisture, humidity, pestScore, healthScore } = reading

  const isRecent =
    Date.now() - new Date(timestamp).getTime() < 5 * 60 * 1000

  return (
    <div
      className={`latest-reading-card ${
        isRecent ? 'recent' : 'stale'
      }`}
    >
      <h3>Latest Reading</h3>
      <p className="timestamp">
        {new Date(timestamp).toLocaleString()}
      </p>

      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">Moisture</span>
          <span className="metric-value">
            {formatNumber(moisture, '%')}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Humidity</span>
          <span className="metric-value">
            {formatNumber(humidity, '%')}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Pest Score</span>
          <span className="metric-value">
            {formatNumber(pestScore)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Health Score</span>
          <span className="metric-value">
            {formatNumber(healthScore)}
          </span>
        </div>
      </div>

      {!isRecent && (
        <div className="warning">
          ⚠️ Data may be older than 5 minutes
        </div>
      )}
    </div>
  )
}

export default LatestReadingCard

