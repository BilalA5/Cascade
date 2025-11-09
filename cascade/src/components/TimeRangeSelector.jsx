import React from 'react'

const PRESETS = [
  { label: 'All time', value: 'all' },
  { label: 'Last hour', value: '1h' },
  { label: 'Last 24h', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
]

const toISOString = (date) => date.toISOString()

function TimeRangeSelector({ onRangeChange, currentRange }) {
  const handleSelect = (preset) => {
    if (preset === 'all') {
      onRangeChange({ startTime: null, endTime: null })
      return
    }

    const end = new Date()
    const start = new Date(end)

    switch (preset) {
      case '1h':
        start.setHours(end.getHours() - 1)
        break
      case '24h':
        start.setHours(end.getHours() - 24)
        break
      case '7d':
        start.setDate(end.getDate() - 7)
        break
      default:
        break
    }

    onRangeChange({
      startTime: toISOString(start),
      endTime: toISOString(end),
    })
  }

  const activePreset = (() => {
    if (!currentRange?.startTime || !currentRange?.endTime) {
      return 'all'
    }
    return null
  })()

  return (
    <div className="time-range-selector">
      <span>Time range:</span>
      <div className="preset-buttons">
        {PRESETS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            className={
              activePreset === value
                ? 'preset-button active'
                : 'preset-button'
            }
            onClick={() => handleSelect(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeRangeSelector

