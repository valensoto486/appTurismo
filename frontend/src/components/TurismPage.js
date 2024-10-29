import React, { useState, useEffect } from 'react';
import '../styles/TurismPage.css';

const TourismPage = ({ municipio }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);

        const response = await fetch('https://buscarubicacionespormunicipio-jkomhrg5ba-uc.a.run.app/', {
          method: 'POST',
          body: JSON.stringify({ "Municipio": municipio }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        // Lee la respuesta como FormData
        const formData = await response.formData();
        const jsonDocument = formData.get('documentos');

        if (!jsonDocument) {
          console.error("No se encontró el JSON de documentos en el form-data");
          setError("No se encontraron datos de lugares");
          setLoading(false);
          return;
        }

        const jsonText = await jsonDocument.text();
        const placesData = JSON.parse(jsonText);

        // Asocia las imágenes a los lugares
        const placesWithImages = placesData.map(place => {
          const imageFile = formData.get(place.URLImagen);
          if (imageFile) {
            place.imageUrl = URL.createObjectURL(imageFile);
          }
          return place;
        });

        setPlaces(placesWithImages);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los lugares:', err);
        setError("Error al cargar los lugares");
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [municipio]);

  // Filtra los lugares según el término de búsqueda
  const filteredPlaces = places.filter(place =>
    place && place.name && place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tourism-page">
      <h1>Descubre {municipio}</h1>
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
            filteredPlaces.map((place, index) => (
              <div key={index} className="place-item">
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
