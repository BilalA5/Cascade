import React from 'react'
import './theme.css'

const formatNumber = (value, digits = 1) => {
  if (value === null || value === undefined) return '—'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return '—'
  return numeric.toFixed(digits)
}

const formatTime = (timestamp) => {
  if (!timestamp) return '—'
  try {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

export default function WeatherInsight({ summary, error, loading }) {
  const current = summary?.current
  const forecast = summary?.forecast

  const nextHours = forecast?.hourly?.slice(0, 3) ?? []

  return (
    <div className="card">
      <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
        Field Weather Outlook
      </h3>
      {loading ? (
        <p style={{ color: 'var(--text-subtle)' }}>Loading weather data…</p>
      ) : error ? (
        <p style={{ color: 'var(--text-subtle)' }}>
          Unable to load weather data. {error}
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                Current temperature
              </p>
              <p style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                {formatNumber(current?.temperature)}°C
              </p>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                Feels like {formatNumber(current?.feelsLike)}°C · Humidity{' '}
                {formatNumber(current?.humidity, 0)}%
              </p>
            </div>
            <div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                Wind & pressure
              </p>
              <p style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                {formatNumber(current?.windSpeed)} m/s
              </p>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                {formatNumber(current?.pressure, 0)} hPa · {current?.description ?? '—'}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
              Next few hours
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {nextHours.length === 0 && (
                <p style={{ color: 'var(--text-subtle)' }}>No forecast data available.</p>
              )}
              {nextHours.map((hour, index) => (
                <div
                  key={hour?.timestamp ?? index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    minWidth: '110px',
                  }}
                >
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatTime(hour?.timestamp)}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                    {formatNumber(hour?.temperature)}°C · {(hour?.weather ?? '—')}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Rain chance {formatNumber((hour?.precipitationProbability ?? 0) * 100, 0)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

