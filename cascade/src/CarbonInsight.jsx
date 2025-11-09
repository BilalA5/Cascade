import React from 'react'
import './theme.css'

const formatNumber = (value, digits = 2) => {
  if (value === null || value === undefined) return '—'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return '—'
  return numeric.toFixed(digits)
}

export default function CarbonInsight({
  summary,
  error,
  loading,
}) {
  const estimate = summary?.estimate
  const project = summary?.project

  return (
    <div className="card">
      <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
        Carbon Footprint Snapshot
      </h3>
      {loading ? (
        <p style={{ color: 'var(--text-subtle)' }}>Fetching carbon metrics…</p>
      ) : error ? (
        <p style={{ color: 'var(--text-subtle)' }}>
          Unable to load carbon metrics. {error}
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                Irrigation electricity footprint
              </p>
              <p style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                {formatNumber(estimate?.carbonKg)} kg CO₂
              </p>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                {formatNumber(estimate?.electricityValue, 0)} {estimate?.electricityUnit} ·{' '}
                {estimate?.state?.toUpperCase()}, {estimate?.country?.toUpperCase()}
              </p>
            </div>
            {estimate?.carbonMt != null && (
              <div>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                  Equivalent metric tonnes
                </p>
                <p style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                  {formatNumber(estimate?.carbonMt, 4)} mt
                </p>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  {formatNumber(estimate?.carbonLb)} lb CO₂
                </p>
              </div>
            )}
          </div>
          {project && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                Featured carbon project
              </p>
              <p style={{ fontWeight: 600 }}>{project.name}</p>
              {project.climateActionType && (
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  {project.climateActionType}
                </p>
              )}
              {project.shortDescription && (
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {project.shortDescription}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

