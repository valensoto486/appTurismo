import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Eventos.css';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://127.0.0.1:5001/turismoeco-598e9/us-central1/ObtenerEventos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      setError("Hubo un problema al cargar los eventos. Por favor, intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

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
          {isLoading ? (
            <p>Cargando eventos...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : eventos.length > 0 ? (
            eventos.map((evento) => (
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
            ))
          ) : (
            <p>No hay eventos disponibles en este momento.</p>
          )}
        </section>
      </main>
    </div>
  );
}