import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../styles/DashboardAdmin.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEventos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');

  useEffect(() => {
    // Obtener eventos, contenido y comentarios al cargar el componente
    fetchEvents();
    fetchContent();
    fetchComments();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://buscareventos-jkomhrg5ba-uc.a.run.app');
      if (!response.ok) throw new Error('Failed to fetch events');

      const formData = await response.formData();
      const jsonDocument = formData.get('documentos');
      
      if (!jsonDocument) throw new Error("No se encontraron datos de eventos");

      const jsonText = await jsonDocument.text();
      const eventsData = JSON.parse(jsonText);

      const eventsWithImages = eventsData.map(event => {
        const imageFile = formData.get(event.URLImagen);
        if (imageFile) event.imageUrl = URL.createObjectURL(imageFile);
        return event;
      });

      setEventos(eventsWithImages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch("https://buscarcontenidomultimedia-jkomhrg5ba-uc.a.run.app", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    setContent(result);
  };

  const fetchComments = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch("https://buscarcomentarios-jkomhrg5ba-uc.a.run.app", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    setComments(result);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
  
    // Verificar si el token de autenticación está presente
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No hay token de autenticación. Por favor, inicie sesión.");
      return;
    }
  
    // Definir los metadatos del evento
    const metadata = {
      nombre: "Nombre del Evento",
      municipio: "Municipio",
      descripcion: "Descripción del evento",
      fecha_inicio: fechaInicio,
      fecha_final: fechaFinal,
    };
  
    // Crear un objeto FormData para enviar los datos del evento y el archivo
    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("file", selectedFile);  
  
    try {
      // Enviar la solicitud POST para crear el evento
      const response = await fetch("https://crearevento-jkomhrg5ba-uc.a.run.app", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
  
      // Intentar leer la respuesta como texto
      const result = await response.text(); // Usamos text() en lugar de json() para manejar cualquier tipo de respuesta
  
      // Verificar si la respuesta fue exitosa
      if (response.ok) {
        alert("Evento creado correctamente");
        fetchEvents(); // Actualizar la lista de eventos
      } else {
        // Si la respuesta no es exitosa, mostrar el error
        alert(`Error al crear evento: ${result}`); // Mostrar el mensaje de error recibido en texto
      }
    } catch (error) {
      // Si ocurre un error en la solicitud fetch, mostrar el error
      console.error("Error al crear evento:", error);
      alert("Ocurrió un error al crear el evento. Por favor, inténtelo nuevamente.");
    }
  };
  
  

  const handleModifyEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const metadata = {
      nombre: "Nuevo Nombre del Evento",
      uuid: selectedItem.id,
      municipio: "Nuevo Municipio",
      descripcion: "Nueva Descripción",
      fecha_inicio: "12/25/23 08:00:00",
      fecha_final: "12/26/23 18:00:00",
    };
    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metadata));
    if (selectedFile) formData.append("file", selectedFile);
    try {
      const response = await fetch("https://modificarevento-jkomhrg5ba-uc.a.run.app", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.text();
      if (response.ok) {
        alert("Evento modificado correctamente");
        fetchEvents(); // Actualizar la lista de eventos
      } else {
        alert("Error al modificar evento: " + result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteEvent = async (uuid) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("https://eliminarevento-jkomhrg5ba-uc.a.run.app", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid }),
      });
      const result = await response.text();
      if (response.ok) {
        alert("Evento eliminado correctamente");
        fetchEvents(); // Actualizar la lista de eventos
      } else {
        alert("Error al eliminar evento: " + result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteContent = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("https://eliminarcontenido-jkomhrg5ba-uc.a.run.app", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        alert("Contenido eliminado correctamente");
        fetchContent(); // Actualizar la lista de contenido
      } else {
        alert("Error al eliminar contenido");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteComment = async (uuid_comentario, uuid_ubicacion) => {
    const token = localStorage.getItem("authToken");  // Obtener el token de localStorage
    try {
      const response = await fetch("https://your-cloud-function-url", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,  // Se pasa el token en el header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid_comentario,
          uuid_ubicacion,
        }),
      });
  
      if (response.ok) {
        alert("Comentario borrado correctamente");
        fetchComments(); // Actualizar la lista de comentarios después de eliminar uno
      } else {
        const result = await response.text();
        alert("Error al borrar comentario: " + result);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al eliminar el comentario");
    }
  };
  

  const confirmAction = (action, item) => {
    setSelectedItem(item);
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const executeAction = () => {
    switch (dialogAction) {
      case 'deleteEvent':
        handleDeleteEvent(selectedItem.id);
        break;
      case 'deleteContent':
        handleDeleteContent(selectedItem.id);
        break;
      // Add cases for other actions if needed
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard de Administración - Antioquia Verde</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Eventos
        </button>
        <button
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Contenido
        </button>
        <button
          className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Comentarios
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'events' && (
          <div>
            <h2>Crear Evento</h2>
            <form onSubmit={selectedItem ? handleModifyEvent : handleCreateEvent} className="form">
              <input
                type="text"
                placeholder="Título del Evento"
                defaultValue={selectedItem?.title}
                required
              />
              <input
                type="text"
                placeholder="Municipio"
                defaultValue={selectedItem?.municipio}
                required
              />
              <textarea
                placeholder="Descripción"
                defaultValue={selectedItem?.description}
                required
              ></textarea>
              <input
                type="date"
                placeholder="Fecha de Inicio"
                defaultValue={selectedItem?.startDate}
                onChange={(e) => setFechaInicio(e.target.value)} // Almacena la fecha de inicio
                required
              />
              <input
                type="date"
                placeholder="Fecha Final"
                defaultValue={selectedItem?.endDate}
                onChange={(e) => setFechaFinal(e.target.value)} // Almacena la fecha final
                required
              />
              <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <button type="submit">{selectedItem ? 'Modificar Evento' : 'Crear Evento'}</button>
            </form>

            <h2>Lista de Eventos</h2>
            <ul>
              {events.map((event) => (
                <li key={event.id} className="event-item">
                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <p><strong>Fecha de Inicio:</strong> {event.fecha_inicio && !isNaN(new Date(event.fecha_inicio)) ? format(new Date(event.fecha_inicio), 'dd/MM/yyyy') : 'Fecha no válida'}</p>
                    <p><strong>Fecha Final:</strong> {event.fecha_final && !isNaN(new Date(event.fecha_final)) ? format(new Date(event.fecha_final), 'dd/MM/yyyy') : 'Fecha no válida'}</p>
                  </div>
                  
                  {/* Mostrar la imagen si existe */}
                  {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="event-image" />}
                  
                  {/* Botones de modificar y eliminar */}
                  <div className="event-actions">
                    <button onClick={() => handleModifyEvent(event)}>Modificar</button>
                    <button onClick={() => confirmAction('deleteEvent', event)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'content' && (
          <div>
            <h2>Gestión de Contenido</h2>
            <ul>
              {content.map(item => (
                <li key={item.id}>
                  {item.name} - {item.description}
                  <button onClick={() => confirmAction('deleteContent', item)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'comments' && (
          <div>
            <h2>Comentarios</h2>
            <ul>
            {comments.map(comment => (
              <li key={comment.id}>
                {comment.author}: {comment.content}
                <button onClick={() => handleDeleteComment(comment.id, comment.uuid_ubicacion)}>
                  Eliminar Comentario
                </button>
              </li>
            ))}
            </ul>
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="dialog">
          <p>¿Estás seguro de que deseas eliminar este ítem?</p>
          <button onClick={executeAction}>Sí</button>
          <button onClick={() => setIsDialogOpen(false)}>No</button>
        </div>
      )}
    </div>
  );
}

