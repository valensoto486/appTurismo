import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../styles/DashboardAdmin.css';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEventos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [newPlace, setNewPlace] = useState({
    nombre: '',
    descripcion: '',
    municipio: ''
  });

  useEffect(() => {
    // Obtener eventos, contenido y comentarios al cargar el componente
    fetchEvents();
    fetchPlaces();
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

  const fetchPlaces = async () => {
    try {
      setLoading(true);
  
      // Lista de municipios
      const municipios = ['Rionegro', 'La Ceja', 'La Unión', 'El Carmen', 'El Retiro'];
  
      // Creamos un arreglo para almacenar los lugares de todos los municipios
      let allPlacesData = [];
  
      for (const municipio of municipios) {
        const response = await fetch('https://buscarubicacionespormunicipio-jkomhrg5ba-uc.a.run.app/', {
          method: 'POST',
          body: JSON.stringify({ municipio }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) throw new Error(`Error al cargar lugares de ${municipio}`);
  
        const contentType = response.headers.get('content-type');
        let placesData = [];
  
        if (contentType.includes('application/json')) {
          placesData = await response.json();
        } else if (contentType.includes('multipart/form-data')) {
          const formData = await response.formData();
          const jsonFile = formData.get('documentos');
  
          if (!jsonFile) {
            setError(`No se encontraron datos de lugares para ${municipio}`);
            return;
          }
  
          const jsonText = await jsonFile.text();
          placesData = JSON.parse(jsonText);
          placesData = placesData.map(place => {
            const imageFile = formData.get(place.URLImagen);
            if (imageFile) place.imageUrl = URL.createObjectURL(imageFile);
            return place;
          });
        } else {
          throw new Error(`Formato de respuesta no soportado para ${municipio}`);
        }
  
        // Agregar los lugares de este municipio al arreglo general
        allPlacesData = [...allPlacesData, ...placesData];
      }
  
      // Setear los lugares de todos los municipios
      setPlaces(allPlacesData);
    } catch (err) {
      console.error('Error al cargar los lugares:', err);
      setError("Error al cargar los lugares");
    } finally {
      setLoading(false);
    }
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

  const handleDeleteEvent = async (Id) => {
    console.log("Eliminando evento con ID:", Id);
    if (!Id) {
      console.error("El UUID no es válido:", Id);
      alert("No se puede eliminar el evento, ID no válido.");
      return; // Salir si el UUID es inválido
    }
    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken)
    console.log('UUID del evento:', Id); 
    try {
      
      const response = await fetch("https://eliminarevento-jkomhrg5ba-uc.a.run.app", {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer `+token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid: Id }),
      });
      const result = await response.text();
      console.log('Respuesta del servidor:', result);
      if (response.ok) {
        alert("Evento eliminado correctamente");
        window.location.reload();
        fetchEvents(); // Actualizar la lista de eventos
      } else {
        const errorText = await response.text(); // Leer respuesta como texto en caso de error
        console.error("Error:", errorText);
        alert(errorText); // Mostrar el mensaje de error
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    // Crear un FormData para enviar tanto los metadatos como el archivo
    const formData = new FormData();
    formData.append("metadata", JSON.stringify(newPlace)); // Adjuntar el JSON con los metadatos
    formData.append("file", selectedFile); // Asegúrate de que selectedFile es el archivo que el usuario ha seleccionado

    try {
      const response = await fetch('https://crearubicacion-jkomhrg5ba-uc.a.run.app', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData, // Enviar FormData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Lugar creado con éxito');
        setNewPlace({ nombre: '', descripcion: '', municipio: '' }); // Limpiar el formulario
        fetchPlaces(); // Recargar la lista de lugares
      } else {
        alert('Error al crear lugar: ' + data.message);
      }
    } catch (error) {
      console.error('Error al crear el lugar:', error);
    }
  };

  
  const handleDeleteContent = async (uuid_lugar, uuid_recurso) => {
    console.log(uuid_lugar, uuid_recurso);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("https://eliminarcontenido-jkomhrg5ba-uc.a.run.app", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid_lugar: uuid_lugar,
          uuid_recurso: uuid_recurso
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Contenido eliminado correctamente");
        fetchPlaces(); // Actualizar la lista de contenido
      } else {
        alert("Error al eliminar contenido", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const confirmAction = (action, event) => {
    console.log("Item recibido en confirmAction:", event);
    setSelectedItem(event );
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const executeAction = () => {
    switch (dialogAction) {
      case 'deleteEvent':
        handleDeleteEvent(selectedItem.Id);
        break;
      case 'deleteContent':
        handleDeleteContent(selectedItem.uuid_lugar, selectedItem.uuid_recurso);
        break;
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
              <button type="submit">{'Crear'}</button>
            </form>

            <h2>Lista de Eventos</h2>
            <table className="events-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Fecha de Inicio</th>
                  <th>Fecha Final</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.Id}>
                    <td>{event.Nombre}</td>
                    <td>{event.Descripcion}</td>
                    <td>
                      {event.Comienza && !isNaN(new Date(event.Comienza))
                        ? format(new Date(event.Comienza), 'MM/dd/yyyy')
                        : 'Fecha no válida'}
                    </td>
                    <td>
                      {event.Termina && !isNaN(new Date(event.Termina))
                        ? format(new Date(event.Termina), 'MM/dd/yyyy')
                        : 'Fecha no válida'}
                    </td>
                    <td>
                      {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="event-image" />}
                    </td>
                    <td className="event-actions">
                      <button className="modify-button" onClick={() => handleModifyEvent(event)}>Modificar</button>
                      <button className="delete-button" onClick={() => confirmAction('deleteEvent', event)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'content' && (
          <div>
            <h2>Crear Lugar</h2>
            <form onSubmit={handleCreatePlace} className="create-place-form">
              <input
                type="text"
                placeholder="Nombre del Lugar"
                value={newPlace.nombre}
                onChange={(e) => setNewPlace({ ...newPlace, nombre: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                value={newPlace.descripcion}
                onChange={(e) => setNewPlace({ ...newPlace, descripcion: e.target.value })}
                required
              ></textarea>
              <select
                value={newPlace.municipio}
                onChange={(e) => setNewPlace({ ...newPlace, municipio: e.target.value })}
                required
              >
                <option value="">Seleccione un Municipio</option>
                <option value="Rionegro">Rionegro</option>
                <option value="La Ceja">La Ceja</option>
                <option value="El Retiro">El Retiro</option>
                <option value="El Carmen">El Carmen</option>
                <option value="La Union">La Union</option>
              </select>
              
              {/* Campo para seleccionar archivo */}
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])} // Guarda el archivo seleccionado
                required
              />
              
              <button type="submit">Crear Lugar</button>
            </form>


            <h2>Gestión de Contenido</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Municipio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {places.map(place => (
                  <tr key={place.id}>
                    <td>{place.Nombre}</td>
                    <td>{place.Descripcion}</td>
                    <td>{place.Municipio}</td>
                    <td>
                      <button className="delete-button" onClick={() => confirmAction('deleteContent', place)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <p>¿Estás seguro de que deseas eliminar este ítem?</p>
            <button onClick={executeAction}>Sí</button>
            <button onClick={() => setIsDialogOpen(false)}>No</button>
          </div>
        </div>
      )}

    </div>
  );
}

