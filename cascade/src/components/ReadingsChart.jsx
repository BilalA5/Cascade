import React, { useMemo } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

function ReadingsChart({ readings, loading }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(readings)) {
      return []
    }

    return readings
      .slice()
      .reverse()
      .map((reading) => ({
        timestamp: reading.timestamp
          ? new Date(reading.timestamp).toLocaleTimeString()
          : '',
        moisture:
          reading.moisturePct ??
          reading.moisture ??
          undefined,
        healthScore: reading.healthScore,
      }))
  }, [readings])

  return (
    <div className="readings-chart-container">
      <h3>Trends</h3>
      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="moisture"
              stroke="#1d4ed8"
              name="Moisture (%)"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="healthScore"
              stroke="#16a34a"
              name="Health Score"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default ReadingsChart

