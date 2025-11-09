import React, { useMemo, useState } from 'react'

const SORT_FIELDS = [
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'moisture', label: 'Moisture (%)' },
  { key: 'humidity', label: 'Humidity (%)' },
  { key: 'pestScore', label: 'Pest Score' },
  { key: 'healthScore', label: 'Health Score' },
]

const formatValue = (value) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '—'
  }
  return Number(value).toFixed(1)
}

function ReadingsTable({ readings, loading }) {
  const [sortField, setSortField] = useState('timestamp')
  const [sortDirection, setSortDirection] = useState('desc')

  const sortedReadings = useMemo(() => {
    if (!Array.isArray(readings)) {
      return []
    }

    return [...readings].sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'timestamp') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })
  }, [readings, sortField, sortDirection])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      return
    }
    setSortField(field)
    setSortDirection('desc')
  }

  if (loading) {
    return (
      <div className="readings-table-container">
        <div className="loading-spinner" />
        <p>Loading readings…</p>
      </div>
    )
  }

  return (
    <div className="readings-table-container">
      <h3>Recent Readings ({sortedReadings.length})</h3>
      <div className="table-wrapper">
        <table className="readings-table">
          <thead>
            <tr>
              {SORT_FIELDS.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className={
                    sortField === key ? `sort-${sortDirection}` : ''
                  }
                >
                  {label}
                </th>
              ))}
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            {sortedReadings.map((reading, index) => (
              <tr key={`${reading.timestamp}-${index}`}>
                <td>
                  {reading.timestamp
                    ? new Date(reading.timestamp).toLocaleString()
                    : '—'}
                </td>
                <td>{formatValue(reading.moisture)}</td>
                <td>{formatValue(reading.humidity)}</td>
                <td>{formatValue(reading.pestScore)}</td>
                <td>{formatValue(reading.healthScore)}</td>
                <td>{reading.deviceId || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedReadings.length === 0 && (
        <div className="no-data">
          <p>No readings available.</p>
        </div>
      )}
    </div>
  )
}

export default ReadingsTable

