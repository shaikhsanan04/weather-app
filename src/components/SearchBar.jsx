import React, { useState } from 'react'

const SearchBar = ({ onSearch, onCurrentLocation, loading }) => {
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim() && !loading) {
      onSearch(city.trim())
      setCity('')
    }
  }

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-btn"
          disabled={loading || !city.trim()}
        >
          <span>🔍</span>
          <span>Search</span>
        </button>
        <button 
          type="button" 
          className="location-btn"
          onClick={onCurrentLocation}
          disabled={loading}
        >
          <span>📍</span>
          <span>My Location</span>
        </button>
      </form>
    </div>
  )
}

export default SearchBar