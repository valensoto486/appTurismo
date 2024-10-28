import React, { useEffect, useState } from 'react';  
import '../styles/Eventos.css';

// La pagina Eventos llama por medio de un GET a la funcion buscareventos
// buscareventos retorna un multipart/form-data 
// form-data: JSON de la lista de los eventos y una lista de sus imagenes
// Los eventos se muestran como un listado con su foto, titulo y breve descripcion
function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://buscareventos-jkomhrg5ba-uc.a.run.app');
        if (!response.ok) throw new Error('Failed to fetch events');

        const formData = await response.formData();
        const jsonDocument = formData.get('documentos');
        
        if (!jsonDocument) {
          console.error("No se encontró el JSON de documentos en el form-data");
          setError("No se encontraron datos de eventos");
          setLoading(false);
          return;
        }

        const jsonText = await jsonDocument.text();
        const eventsData = JSON.parse(jsonText);

        const eventsWithImages = eventsData.map(event => {
          const imageFile = formData.get(event.URLImagen);
          if (imageFile) {
            event.imageUrl = URL.createObjectURL(imageFile);
          }
          return event;
        });

        setEventos(eventsWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
        setError("Error al cargar los eventos");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Cargando eventos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (eventos.length === 0) {
    return <div>No hay eventos disponibles.</div>;
  }

  return (
    <div className="eventos-page">
      <header className="eventos-header">
        <div className="container">
          <h1>Eventos</h1>
        </div>
      </header>

      <main className="container">
        <section className="eventos-info">
          <h2>Descubre Nuestros Eventos</h2>
          <p>
            Participa en nuestros eventos y contribuye a la conservación de Antioquia mientras disfrutas de experiencias únicas.
          </p>
        </section>

        <div className="eventos-list">
          {eventos.map((evento) => (
            <div key={evento.Id} className="evento">
              <img src={evento.imageUrl} alt={evento.Nombre} />
              <h2>{evento.Nombre}</h2>
              <p>{evento.Descripcion}</p>
              <p>{evento.Comienza} - {evento.Termina}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Eventos;
