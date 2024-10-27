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
        const eventosData = await fetch('https://buscareventos-jkomhrg5ba-uc.a.run.app'); // Llama a la función para obtener eventos
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
            <div key={evento.id} className="evento-card">
              <img src={evento.imagen} alt={evento.titulo} />
              <div className="evento-info">
                <h3>{evento.titulo}</h3>
                <p>{evento.descripcion}</p>
                <Link to={`/evento/${evento.id}`} className="btn-ver-mas">
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