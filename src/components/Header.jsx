import React from 'react'

const Header = ({ isDarkTheme, toggleTheme, unit, toggleUnit }) => {
  return (
    <header className="header glass-card">
      <div className="logo">
        <span className="logo-icon">🌤️</span>
        <span>WeatherGlass</span>
      </div>
      <div className="header-controls">
        <button className="control-btn" onClick={toggleUnit}>
          <span>{unit === 'metric' ? '°C' : '°F'}</span>
        </button>
        <button className="control-btn" onClick={toggleTheme}>
          <span>{isDarkTheme ? '☀️' : '🌙'}</span>
          <span>{isDarkTheme ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  )
}

export default Header