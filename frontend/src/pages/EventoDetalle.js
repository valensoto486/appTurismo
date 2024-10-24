// pages/EventoDetalle.js
import React from 'react';
import { useParams } from 'react-router-dom';

const EventoDetalle = () => {
  const { id } = useParams();
  
  // Aquí puedes simular o recuperar los detalles del evento desde una base de datos
  const eventos = [
    { id: 1, titulo: "Festival de la Naturaleza", descripcion: "Celebra la biodiversidad de Antioquia", imagen: "/placeholder.svg?height=400&width=600" },
    { id: 2, titulo: "Feria Gastronómica Sostenible", descripcion: "Degusta platos locales preparados con ingredientes orgánicos", imagen: "/placeholder.svg?height=400&width=600" },
    { id: 3, titulo: "Taller de Ecoturismo", descripcion: "Aprende sobre prácticas de turismo responsable", imagen: "/placeholder.svg?height=400&width=600" },
    { id: 4, titulo: "Caminata Ecológica", descripcion: "Explora los senderos naturales de la región", imagen: "/placeholder.svg?height=400&width=600" },
  ];

  const evento = eventos.find(event => event.id === parseInt(id));

  if (!evento) {
    return <div>No se encontró el evento.</div>;
  }

  return (
    <div className="evento-detalle">
      <h1>{evento.titulo}</h1>
      <img src={evento.imagen} alt={evento.titulo} />
      <p>{evento.descripcion}</p>
    </div>
  );
};

export default EventoDetalle;
