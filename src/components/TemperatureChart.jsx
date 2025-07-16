import React from 'react'

const TemperatureChart = ({ forecastData, unit }) => {
  if (!forecastData) return null

  // Get 8 forecast items (24 hours - 3 hour intervals)
  const chartData = forecastData.list.slice(0, 8)
  
  const temperatures = chartData.map(item => item.main.temp)
  const maxTemp = Math.max(...temperatures)
  const minTemp = Math.min(...temperatures)
  const tempRange = maxTemp - minTemp || 1

  const getX = (index) => (index * 85) / (chartData.length - 1) + 7.5
  const getY = (temp) => 85 - ((temp - minTemp) / tempRange) * 70 + 7.5

  const pathData = chartData.map((item, index) => {
    const x = getX(index)
    const y = getY(item.main.temp)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const tempUnit = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="temperature-chart glass-card">
      <h3>24-Hour Temperature Trend</h3>
      <div className="chart-container">
        <svg className="chart-svg" viewBox="0 0 100 100">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Chart area background */}
          <rect x="5" y="5" width="90" height="90" fill="rgba(255,255,255,0.05)" rx="5" />
          
          {/* Chart line */}
          <path
            d={pathData}
            className="chart-line"
          />
          
          {/* Chart points */}
          {chartData.map((item, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(item.main.temp)}
              r="4"
              className="chart-point"
              title={`${Math.round(item.main.temp)}${tempUnit} at ${formatTime(item.dt)}`}
            />
          ))}
          
          {/* Temperature labels on points */}
          {chartData.map((item, index) => (
            <text
              key={`temp-${index}`}
              x={getX(index)}
              y={getY(item.main.temp) - 8}
              textAnchor="middle"
              fill="rgba(255,255,255,0.8)"
              fontSize="3"
              fontWeight="600"
            >
              {Math.round(item.main.temp)}°
            </text>
          ))}
        </svg>
      </div>
      
      <div className="chart-labels">
        {chartData.map((item, index) => (
          <div key={index} className="chart-label">
            <div className="chart-time">{formatTime(item.dt)}</div>
            <div className="chart-temp">{Math.round(item.main.temp)}{tempUnit}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TemperatureChart