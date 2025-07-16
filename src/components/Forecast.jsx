import React from 'react'

const Forecast = ({ forecastData, unit }) => {
  if (!forecastData) return null

  const getWeatherIcon = (weatherMain, weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return '⛈️'
    if (weatherId >= 300 && weatherId < 400) return '🌦️'
    if (weatherId >= 500 && weatherId < 600) return '🌧️'
    if (weatherId >= 600 && weatherId < 700) return '❄️'
    if (weatherId >= 700 && weatherId < 800) return '🌫️'
    if (weatherId === 800) return '☀️'
    if (weatherId > 800) return '☁️'
    
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    }
    return icons[weatherMain] || '🌤️'
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get daily forecast by filtering one forecast per day at noon
  const dailyForecast = []
  const processedDates = new Set()
  
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dateString = date.toDateString()
    const hour = date.getHours()
    
    // Prefer noon time (12:00) for daily forecast, or closest to noon
    if (!processedDates.has(dateString) && (hour >= 11 && hour <= 13)) {
      dailyForecast.push(item)
      processedDates.add(dateString)
    }
  })
  
  // If we don't have enough noon forecasts, fill with any available
  if (dailyForecast.length < 5) {
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000)
      const dateString = date.toDateString()
      
      if (!processedDates.has(dateString) && dailyForecast.length < 5) {
        dailyForecast.push(item)
        processedDates.add(dateString)
      }
    })
  }

  const tempUnit = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="forecast glass-card">
      <h3>5-Day Forecast</h3>
      <div className="forecast-list">
        {dailyForecast.slice(0, 5).map((item, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-date">
              {formatDate(item.dt)}
            </div>
            <div className="forecast-icon">
              {getWeatherIcon(item.weather[0].main, item.weather[0].id)}
            </div>
            <div className="forecast-temps">
              <span className="temp-high">
                {Math.round(item.main.temp_max)}{tempUnit}
              </span>
              <span className="temp-low">
                {Math.round(item.main.temp_min)}{tempUnit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Forecast