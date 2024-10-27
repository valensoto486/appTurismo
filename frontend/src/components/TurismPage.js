import React, { useState, useEffect } from 'react';
import '../styles/TurismPage.css';

const TourismPage = ({ city }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://your-backend-url.com/api/places?city=${city}`);
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data = await response.json();
        setPlaces(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [city]);

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tourism-page">
      <h1>Descubre {city}</h1>
      <div className="filter-search-container">
        <div className="filter">
          <h2>Filtros</h2>
          <div className="filter-options">
            <label>
              <input type="checkbox" /> Hoteles
            </label>
            <label>
              <input type="checkbox" /> Restaurantes
            </label>
            <label>
              <input type="checkbox" /> Atracciones
            </label>
          </div>
        </div>
        <div className="search">
          <input 
            type="text" 
            placeholder="Buscar lugares..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar lugares"
          />
        </div>
      </div>
      {loading ? (
        <p>Cargando lugares...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="places-list">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <div key={place.id} className="place-item">
                <img src={place.image} alt={place.name} className="place-image" />
                <div className="place-info">
                  <h2>{place.name}</h2>
                  <p>{place.description}</p>
                  <p className="place-type">{place.type}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron lugares para esta búsqueda.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TourismPage;