import React from 'react'

const Favorites = ({ favorites, onSelectCity, onRemoveCity }) => {
  if (favorites.length === 0) {
    return (
      <div className="favorites glass-card">
        <h3>Favorite Cities</h3>
        <div className="favorites-empty">
          <p>No favorite cities yet.</p>
          <p>Add some by clicking the ❤️ icon!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites glass-card">
      <h3>Favorite Cities</h3>
      <div className="favorites-list">
        {favorites.map((city, index) => (
          <div key={index} className="favorite-item">
            <span 
              className="favorite-name"
              onClick={() => onSelectCity(city)} 
              style={{ cursor: 'pointer' }}
            >
              {city}
            </span>
            <button 
              className="remove-btn"
              onClick={() => onRemoveCity(city)}
              title="Remove from favorites"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites