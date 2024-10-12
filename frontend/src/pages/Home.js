import React from 'react';
import '../styles/Home.css';
import elRetiro from '../styles/images/ElRetiro.jpg';
import laCeja from '../styles/images/LaCeja.jpg';
import elCarmen from '../styles/images/ElCarmen.jpg';
import laUnion from '../styles/images/LaUnion.jpg';
import rionegro from '../styles/images/Rionegro.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
  const cityImages = {
    'El Retiro': elRetiro,
    'La Ceja': laCeja,
    'El Carmen': elCarmen,
    'La Unión': laUnion,
    'Rionegro': rionegro,
  };

  return (
    <main className="home">
      <section className="hero">
        <div className="container">
          <h1>Descubre el Turismo Sostenible en Antioquia</h1>
          <p>Explora la belleza natural mientras cuidas el medio ambiente</p>
          <Link className="btn" to="/login">Iniciar Sesión</Link>
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
        <div className="container">
          <h2>Eventos</h2>
          <div className="events-grid">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="event-card">
                <h3>Evento {num}</h3>
                <img src={`/event-${num}.jpg`} alt={`Evento ${num}`} />
                <p>Descripción breve del evento {num}. Fecha y lugar del evento.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;