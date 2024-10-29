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
      
        const response = await fetch(`https://buscarubicacionespormunicipio-jkomhrg5ba-uc.a.run.app?municipio=${encodeURIComponent(city)}`);
      
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
      
        const responseText = await response.text(); // Cambia de JSON a texto
        console.log(responseText); // Imprime el contenido de la respuesta para ver qué se está devolviendo
    
        // Intenta parsear el contenido como JSON si es aplicable
        let placesData;
        try {
          placesData = JSON.parse(responseText);
        } catch (e) {
          throw new Error('Failed to parse JSON');
        }
    
        setPlaces(placesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchPlaces();
  }, [city]);
  
  // Filtra los lugares según el término de búsqueda
  const filteredPlaces = places.filter(place =>
    place && place.name && place.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div key={place.Id} className="place-item">
                {place.imageUrl ? (
                  <img src={place.imageUrl} alt={place.name} className="place-image" />
                ) : (
                  <p>Imagen no disponible</p>
                )}
                <h3>{place.name}</h3>
                <p>{place.description}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron lugares.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TourismPage;
