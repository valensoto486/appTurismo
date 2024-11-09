import '../styles/PlaceDetails.css'; 
import React, { useState, useEffect } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('Anónimo');  // Nombre por defecto como "Anónimo", esto para los usuarios que no iniciaron sesion 

  useEffect(() => {
    const fetchUserInfo = async () => {
      //Obtenemos la info del usuario autenticado
      const response = await fetch('https://autenticarusuario-jkomhrg5ba-uc.a.run.app'); // Este endpoint debe obtener la info del usuario
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      setUserRole(data.role);
      if (data.isAuthenticated) {
        setUserName(data.userName); // Si está autenticado, asigna su nombre
      }
    };

    fetchUserInfo();
  }, []);

  const handleRate = (option, stars) => {
    setRatings(prevRatings => ({ ...prevRatings, [option]: stars }));
  };

  const getGoogleMapsLink = (lat, lng) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const handleSubmit = async () => {
    const comentarioData = {
      uuid_ubicacion: place.uuid,
      contenido: comment,
      autor: userName, // Si no está autenticado, será "Anónimo"
      calificacion: Math.round(
        (ratings.gestionResiduos + ratings.culturaLocal + ratings.movilidadSostenible + ratings.proteccionBiodiversidad) / 4
      ),
      gestion_residuos: ratings.gestionResiduos,
      cuidado_ambiente: ratings.culturaLocal,
      movilidad_sostenible: ratings.movilidadSostenible,
      cultura_local: ratings.proteccionBiodiversidad,
    };

    try {
      const response = await fetch('https://crearcomentario-jkomhrg5ba-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData),
      });

      if (response.ok) {
        alert('Comentario creado correctamente');
        setComment('');
        setRatings({
          gestionResiduos: 0,
          culturaLocal: 0,
          movilidadSostenible: 0,
          proteccionBiodiversidad: 0,
        });
      } else {
        alert('Error al crear el comentario');
      }
    } catch (error) {
      alert('Ocurrió un error al enviar el comentario');
      console.error(error);
    }
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

      <div className="rating-section">
        <h2 className='h2'>Califica este lugar</h2>
        <div className="rating-option">
          <p className='p1'>Gestión de Residuos</p>
          <StarRating rating={ratings.gestionResiduos} onRate={(stars) => handleRate('gestionResiduos', stars)} />
        </div>

        <div className="rating-option">
          <p className='p1'>Cultura Local</p>
          <StarRating rating={ratings.culturaLocal} onRate={(stars) => handleRate('culturaLocal', stars)} />
        </div>

        <div className="rating-option">
          <p className='p1'>Movilidad Sostenible</p>
          <StarRating rating={ratings.movilidadSostenible} onRate={(stars) => handleRate('movilidadSostenible', stars)} />
        </div>

        <div className="rating-option">
          <p className='p1'>Protección de Biodiversidad</p>
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

      {/* Mensaje si no está autenticado */}
      {!isAuthenticated && (
        <p>Si deseas dejar un comentario, puedes hacerlo de forma anónima.</p>
      )}
    </div>
  );
};

export default PlaceDetails;
