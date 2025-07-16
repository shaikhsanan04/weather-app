import React from 'react'

const WeatherCard = ({ weatherData, unit, onAddToFavorites, isFavorite }) => {
  const getWeatherIcon = (weatherMain, weatherId) => {
    // More detailed weather icons based on weather ID
    if (weatherId >= 200 && weatherId < 300) return '⛈️' // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return '🌦️' // Drizzle
    if (weatherId >= 500 && weatherId < 600) return '🌧️' // Rain
    if (weatherId >= 600 && weatherId < 700) return '❄️' // Snow
    if (weatherId >= 700 && weatherId < 800) return '🌫️' // Atmosphere
    if (weatherId === 800) return '☀️' // Clear
    if (weatherId > 800) return '☁️' // Clouds
    
    // Fallback to main weather type
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
      'Smoke': '🌫️',
      'Dust': '🌫️',
      'Sand': '🌫️',
      'Ash': '🌫️',
      'Squall': '💨',
      'Tornado': '🌪️'
    }
    return icons[weatherMain] || '🌤️'
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(degrees / 22.5) % 16]
  }

  if (!weatherData) return null

  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const windUnit = unit === 'metric' ? 'm/s' : 'mph'
  const pressureUnit = 'hPa'

  return (
    <div className="weather-card glass-card">
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={() => onAddToFavorites(weatherData.name)}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      
      <div className="weather-main">
        <div className="weather-icon">
          {getWeatherIcon(weatherData.weather[0].main, weatherData.weather[0].id)}
        </div>
        <div className="weather-info">
          <h2>{Math.round(weatherData.main.temp)}{tempUnit}</h2>
          <p>{weatherData.name}, {weatherData.sys.country}</p>
          <p>{formatDate(weatherData.dt)}</p>
        </div>
      </div>
      
      <div className="weather-description">
        {weatherData.weather[0].description}
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="label">Feels like</span>
          <span className="value">{Math.round(weatherData.main.feels_like)}{tempUnit}</span>
        </div>
        <div className="detail-item">
          <span className="label">Humidity</span>
          <span className="value">{weatherData.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind</span>
          <span className="value">
            {Math.round(weatherData.wind.speed)} {windUnit} {getWindDirection(weatherData.wind.deg)}
          </span>
        </div>
        <div className="detail-item">
          <span className="label">Pressure</span>
          <span className="value">{weatherData.main.pressure} {pressureUnit}</span>
        </div>
        <div className="detail-item">
          <span className="label">Visibility</span>
          <span className="value">{((weatherData.visibility || 10000) / 1000).toFixed(1)} km</span>
        </div>
        <div className="detail-item">
          <span className="label">UV Index</span>
          <span className="value">{weatherData.uvi || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard