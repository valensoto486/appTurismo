import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Eventos.css';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('https://buscareventos-542819207454.us-central1.run.app');
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const formData = await response.formData(); // Obtener los datos como FormData
        const eventosData = JSON.parse(formData.get('documentos')); // Acceder al JSON desde FormData
        setEventos(eventosData);
      } catch (err) {
        setError('Error al cargar los eventos.'); // Manejo de errores
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) {
    return <div>Cargando eventos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="eventos-page">
      <header className="eventos-header">
        <div className="container">
          {/* <h1>Eventos</h1> */}
        </div>
      </header>

      <main className="container">
        <section className="eventos-info">
          <h2>Descubre Nuestros Eventos</h2>
          <p>
            Participa en nuestros eventos y contribuye a la conservación de Antioquia mientras disfrutas de experiencias únicas.
          </p>
        </section>

        <section className="eventos-imagen">
          <img
            src="/placeholder.svg?height=300&width=800"
            alt="Eventos de turismo sostenible"
          />
        </section>

        <section className="eventos-lista">
          {eventos.map((evento) => (
            <div key={evento.Id} className="evento-card">
              <img src={evento.URLImagen} alt={evento.Titulo} />
              <div className="evento-info">
                <h3>{evento.Titulo}</h3>
                <p>{evento.Descripcion}</p>
                <Link to={`/evento/${evento.Id}`} className="btn-ver-mas">
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Eventos;
