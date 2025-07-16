import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import Forecast from './components/Forecast'
import Favorites from './components/Favorites'
import TemperatureChart from './components/TemperatureChart'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [unit, setUnit] = useState('metric')
  const [favorites, setFavorites] = useState([])
  const [currentCity, setCurrentCity] = useState('')

  
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    
    const savedTheme = localStorage.getItem('weatherTheme')
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark')
    }

    const savedUnit = localStorage.getItem('weatherUnit')
    if (savedUnit) {
      setUnit(savedUnit)
    }

    // Get current location weather on load
    getCurrentLocationWeather()
  }, [])

  // Re-fetch weather when unit changes
  useEffect(() => {
    if (currentCity && weatherData) {
      fetchWeatherByCity(currentCity)
    }
  }, [unit])

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherByCoords(latitude, longitude)
        },
        (error) => {
          console.log('Geolocation error:', error)
          fetchWeatherByCity('New York')
        }
      )
    } else {
      fetchWeatherByCity('New York')
    }
  }

  const fetchWeatherByCity = async (city) => {
    setLoading(true)
    setError(null)
    setCurrentCity(city)
    
    try {
      console.log('Fetching weather for:', city, 'with unit:', unit)
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`
      )
      
      console.log('Weather response status:', weatherResponse.status)
      
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json()
        console.log('Weather API error:', errorData)
        throw new Error(errorData.message || 'City not found')
      }
      
      const weatherData = await weatherResponse.json()
      console.log('Weather data:', weatherData)
      setWeatherData(weatherData)
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`
      )
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json()
        console.log('Forecast data:', forecastData)
        setForecastData(forecastData)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching weather for coords:', lat, lon, 'with unit:', unit)
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      )
      
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json()
        throw new Error(errorData.message || 'Location not found')
      }
      
      const weatherData = await weatherResponse.json()
      setWeatherData(weatherData)
      setCurrentCity(weatherData.name)
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      )
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json()
        setForecastData(forecastData)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem('weatherTheme', newTheme ? 'dark' : 'light')
    console.log('Theme toggled to:', newTheme ? 'dark' : 'light')
  }

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
    localStorage.setItem('weatherUnit', newUnit)
    console.log('Unit toggled to:', newUnit)
  }

  const addToFavorites = (city) => {
    if (!favorites.find(fav => fav.toLowerCase() === city.toLowerCase())) {
      const newFavorites = [...favorites, city]
      setFavorites(newFavorites)
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites))
    }
  }

  const removeFromFavorites = (city) => {
    const newFavorites = favorites.filter(fav => fav.toLowerCase() !== city.toLowerCase())
    setFavorites(newFavorites)
    localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites))
  }

  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-default'
    
    const weatherMain = weatherData.weather[0].main.toLowerCase()
    const hour = new Date().getHours()
    const isNight = hour >= 19 || hour <= 6
    
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) return 'bg-rain'
    if (weatherMain.includes('cloud')) return 'bg-cloudy'
    if (weatherMain.includes('snow')) return 'bg-snow'
    if (weatherMain.includes('clear')) return isNight ? 'bg-clear-night' : 'bg-clear-day'
    if (weatherMain.includes('thunderstorm')) return 'bg-storm'
    
    return 'bg-default'
  }

  return (
    <div className={`app ${isDarkTheme ? 'dark' : 'light'} ${getBackgroundClass()}`}>
      <div className="app-container">
        <Header 
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          unit={unit}
          toggleUnit={toggleUnit}
        />
        
        <SearchBar 
          onSearch={fetchWeatherByCity}
          onCurrentLocation={getCurrentLocationWeather}
          loading={loading}
        />
        
        {error && (
          <div className="error-card glass-card">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="dismiss-btn">
              Dismiss
            </button>
          </div>
        )}
        
        {loading && (
          <div className="loading-card glass-card">
            <div className="loading-spinner"></div>
            <p>Fetching weather data...</p>
          </div>
        )}
        
        {weatherData && !loading && (
          <div className="weather-grid">
            <div className="main-column">
              <WeatherCard 
                weatherData={weatherData}
                unit={unit}
                onAddToFavorites={addToFavorites}
                isFavorite={favorites.some(fav => fav.toLowerCase() === weatherData.name.toLowerCase())}
              />
              
              {forecastData && (
                <TemperatureChart 
                  forecastData={forecastData}
                  unit={unit}
                />
              )}
            </div>
            
            <div className="sidebar-column">
              <Favorites 
                favorites={favorites}
                onSelectCity={fetchWeatherByCity}
                onRemoveCity={removeFromFavorites}
              />
              
              {forecastData && (
                <Forecast 
                  forecastData={forecastData}
                  unit={unit}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App