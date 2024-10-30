import '../styles/PlaceDetails.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const StarRating = ({ rating, onRate }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const PlaceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const place = location.state?.place;

  const [ratings, setRatings] = useState({
    gestionResiduos: 0,
    culturaLocal: 0,
    movilidadSostenible: 0,
    proteccionBiodiversidad: 0,
  });
  const [comment, setComment] = useState('');

  const handleRate = (option, stars) => {
    setRatings(prevRatings => ({ ...prevRatings, [option]: stars }));
  };

  const getGoogleMapsLink = (lat, lng) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const handleSubmit = () => {
    console.log('Calificaciones:', ratings);
    console.log('Comentario:', comment);
    alert('¡Gracias por tu retroalimentación!');
  };

  if (!place) {
    return <p>No se encontraron detalles del lugar.</p>;
  }

  return (
    <div className="place-details">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Volver</button>
      <div className="place-content">
        {place.imageUrl ? (
          <img src={place.imageUrl} alt={place.Nombre} className="place-image-large" />
        ) : (
          <p>Imagen no disponible</p>
        )}
        <div className="place-info">
          <h1 className="place-title">{place.Nombre}</h1>
          <p className="place-description">{place.Descripcion}</p>
          {place.Latitud && place.Longitud ? (
            <a
              href={getGoogleMapsLink(place.Latitud, place.Longitud)}
              target="_blank"
              rel="noopener noreferrer"
              className="google-maps-button"
            >
              Ver en Google Maps 🗺️
            </a>
          ) : (
            <p>Ubicación no disponible</p>
          )}
        </div>
      </div>

      {/* Sistema de calificación con estrellas */}
      <div className="rating-section">
        <h2>Califica este lugar</h2>
        <div className="rating-option">
          <p>Gestión de Residuos</p>
          <StarRating rating={ratings.gestionResiduos} onRate={(stars) => handleRate('gestionResiduos', stars)} />
        </div>

        <div className="rating-option">
          <p>Cultura Local</p>
          <StarRating rating={ratings.culturaLocal} onRate={(stars) => handleRate('culturaLocal', stars)} />
        </div>

        <div className="rating-option">
          <p>Movilidad Sostenible</p>
          <StarRating rating={ratings.movilidadSostenible} onRate={(stars) => handleRate('movilidadSostenible', stars)} />
        </div>

        <div className="rating-option">
          <p>Protección de Biodiversidad</p>
          <StarRating rating={ratings.proteccionBiodiversidad} onRate={(stars) => handleRate('proteccionBiodiversidad', stars)} />
        </div>

        <div className="comment-section">
          <textarea
            placeholder="Escribe un comentario..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Enviar</button>
      </div>
    </div>
  );
};

export default PlaceDetails;

