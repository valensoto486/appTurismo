import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Eventos.css';

function Eventos() {
  // Simulación de eventos desde una base de datos
  const eventos = [
    { id: 1, titulo: "Festival de la Naturaleza", descripcion: "Celebra la biodiversidad de Antioquia", imagen: "/placeholder.svg?height=200&width=300" },
    { id: 2, titulo: "Feria Gastronómica Sostenible", descripcion: "Degusta platos locales preparados con ingredientes orgánicos", imagen: "/placeholder.svg?height=200&width=300" },
    { id: 3, titulo: "Taller de Ecoturismo", descripcion: "Aprende sobre prácticas de turismo responsable", imagen: "/placeholder.svg?height=200&width=300" },
    { id: 4, titulo: "Caminata Ecológica", descripcion: "Explora los senderos naturales de la región", imagen: "/placeholder.svg?height=200&width=300" },
  ];

  return (
    <div className="eventos-page">
      <header className="eventos-header">
        <div className="container">
          <h1>Eventos de Turismo Sostenible</h1>
        </div>
      </header>

      <main className="container">
        <section className="eventos-info">
          <h2>Descubre Nuestros Eventos</h2>
          <p>
            Participa en nuestros eventos de turismo sostenible y contribuye a la conservación de Antioquia mientras disfrutas de experiencias únicas.
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