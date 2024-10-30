import '../styles/PlaceDetails.css'
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PlaceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const place = location.state?.place;

  if (!place) {
    return <p>No se encontraron detalles del lugar.</p>;
  }

  return (
    <div className="place-details">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Volver</button>
      <h1 className="place-title">{place.Nombre}</h1>
      {place.imageUrl ? (
        <img src={place.URLImagen} alt={place.Nombre} className="place-image-large" />
      ) : (
        <p>Imagen no disponible</p>
      )}
      <p className="place-description">{place.Descripcion}</p>
    </div>
  );
};

export default PlaceDetails;
