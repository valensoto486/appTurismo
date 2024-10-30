import React, { useState, useEffect } from 'react';
import '../styles/TurismPage.css';
import { useNavigate } from 'react-router-dom';

const TourismPage = ({ municipio }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);

        const response = await fetch('https://buscarubicacionespormunicipio-jkomhrg5ba-uc.a.run.app/', {
          method: 'POST',
          body: JSON.stringify({ "municipio": municipio }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar lugares');
        }

        const contentType = response.headers.get('content-type');

        let placesData = [];

        if (contentType.includes('application/json')) {
          placesData = await response.json(); // Maneja JSON
        } else if (contentType.includes('multipart/form-data')) {
          const formData = await response.formData(); // Extrae el FormData

          // Extrae el archivo JSON del FormData
          const jsonFile = formData.get('documentos');

          if (!jsonFile) {
            console.error("No se encontró el archivo JSON en el form-data");
            setError("No se encontraron datos de lugares");
            setLoading(false);
            return;
          }

          const jsonText = await jsonFile.text(); // Lee el archivo como texto
          placesData = JSON.parse(jsonText); // Parsea el JSON
          
          const eventsWithImages = placesData.map(place => {
            const imageFile = formData.get(place.URLImagen);
            if (imageFile) {
              place.imageUrl = URL.createObjectURL(imageFile);
            }
            return place;
          });
          setPlaces(eventsWithImages);
          setLoading(false);

        } else {
          throw new Error('Formato de respuesta no soportado');
        }

        // handleParsedData(placesData);

      } catch (err) {
        console.error('Error al cargar los lugares:', err);
        setError("Error al cargar los lugares");
        setLoading(false);
      }
    };

    const handleParsedData = (placesData) => {
      if (!Array.isArray(placesData) || placesData.length === 0) {
        console.error("No se encontraron lugares en el JSON.");
        setError("No se encontraron lugares en los datos recibidos.");
        setLoading(false);
        return;
      }

      const placesWithImages = placesData.map(place => ({
        ...place,
        imageUrl: place.URLImagen || null
      }));

      setPlaces(placesWithImages);
      setLoading(false);
    };

    fetchPlaces();
  }, [municipio]);

  const filteredPlaces = places.filter(place =>
    place && place.Nombre && place.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaceClick = (place) => {
    navigate('/placedetails', { state: { place } });
  };


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
              <div key={index} className="place-item" onClick={() => handlePlaceClick(place)}>
                {place.imageUrl ? (
                  <img src={place.imageUrl} alt={place.Nombre} className="place-image" />
                ) : (
                  <p>Imagen no disponible</p>
                )}
                <h3>{place.Nombre}</h3>
                <p>{place.Descripcion}</p>
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
