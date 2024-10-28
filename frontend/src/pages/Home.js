import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import elRetiro from '../styles/images/ElRetiro.jpg';
import laCeja from '../styles/images/LaCeja.jpg';
import elCarmen from '../styles/images/ElCarmen.jpg';
import laUnion from '../styles/images/LaUnion.jpg';
import rionegro from '../styles/images/Rionegro.jpg';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const cityImages = {
    'El Retiro': elRetiro,
    'La Ceja': laCeja,
    'El Carmen': elCarmen,
    'La Unión': laUnion,
    'Rionegro': rionegro,
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://buscareventosinicio-jkomhrg5ba-uc.a.run.app');
        if (!response.ok) throw new Error('Failed to fetch events');

        // Procesa el `form-data`
        const formData = await response.formData();

        // Verifica si `documentos` está presente en el `form-data`
        const jsonDocument = formData.get('documentos');
        if (!jsonDocument) {
          console.error("No se encontró el JSON de documentos en el form-data");
          return;
        }

        // Convierte el archivo JSON en texto y luego a un objeto
        const jsonText = await jsonDocument.text();
        const eventsData = JSON.parse(jsonText);

        // Extrae las imágenes
        const eventsWithImages = eventsData.map(event => {
          const imageFile = formData.get(event.URLImagen); // `URLImagen` es el nombre de cada archivo en el form-data
          if (imageFile) {
            event.imageUrl = URL.createObjectURL(imageFile);
          }
          return event;
        });

        setEvents(eventsWithImages);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);


  return (
    <main className="home">
      <section className="hero">
        <div className="container">
          {!isAuthenticated && (
            <Link className="btn" to="/login">Iniciar Sesión</Link>
          )}
        </div>
      </section>

      <section className="about">
        <div className="container">
          <div className="about-content">
            <h2>¿Qué es el Turismo Sostenible?</h2>
            <p>El turismo sostenible es una forma de viajar que respeta el medio ambiente, la cultura local y contribuye al desarrollo económico de las comunidades. Al practicar el turismo sostenible, ayudamos a preservar los destinos para las generaciones futuras.</p>
          </div>
        </div>
      </section>

      <section className="discover">
        <div className="container">
          <h2>Descubre el Oriente</h2>
          <div className="discover-grid">
            {Object.keys(cityImages).map((city) => (
              <div key={city} className="discover-item">
                <img src={cityImages[city]} alt={city} />
                <h3>{city}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="events">
        <div className="container2">
          <h2>Eventos</h2>
          <div className="events-grid">
            {events.map((event, index) => (
              <div key={index} className="event-card">
                <h3>{event.Nombre}</h3>
                <img src={event.imageUrl} alt={`Evento ${event.Nombre}`} />
                <p>{event.Descripcion}</p>
                <p>Fecha de inicio: {event.Comienza}</p>
                <p>Fecha de término: {event.Termina}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
