import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../styles/DashboardAdmin.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [content, setContent] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [date, setDate] = useState(new Date());
  const [token, setToken] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState('');

  useEffect(() => {
    // Autenticar y obtener token (código existente)
    // Fetch initial data for events, content, and comments
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    // Existing create event logic
  };

  const handleModifyEvent = async (e) => {
    e.preventDefault();
    // Existing modify event logic
  };

  const handleDeleteEvent = async (id) => {
    // Existing delete event logic
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    // Logic for creating content
  };

  const handleDeleteContent = async (id) => {
    // Logic for deleting content
  };

  const handleDeleteComment = async (id) => {
    // Logic for deleting comment
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
      case 'deleteComment':
        handleDeleteComment(selectedItem.id);
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
            <h2>Gestión de Eventos</h2>
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
              <input type="file" accept="image/*" />
              <button type="button" onClick={() => setDate(new Date())} className="date-button">
                {date ? format(date, "PPP") : 'Selecciona una fecha'}
              </button>
              <button type="submit" className="submit-button">
                {selectedItem ? 'Modificar Evento' : 'Crear Evento'}
              </button>
            </form>
            <table>
              <caption>Lista de eventos</caption>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Imagen</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>
                      <img src={event.imageUrl} alt={event.title} width="50" height="50" />
                    </td>
                    <td>{event.description}</td>
                    <td>
                      <button onClick={() => setSelectedItem(event)} className="edit-button">
                        Editar
                      </button>
                      <button onClick={() => confirmAction('deleteEvent', event)} className="delete-button">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <h2>Gestión de Contenido</h2>
            <form onSubmit={handleCreateContent} className="form">
              <input type="text" placeholder="Nombre del lugar" required />
              <textarea placeholder="Descripción del lugar" required></textarea>
              <input type="file" accept="image/*" required />
              <button type="submit" className="submit-button">Crear Contenido</button>
            </form>
            <table>
              <caption>Lista de contenido</caption>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      <img src={item.imageUrl} alt={item.name} width="50" height="50" />
                    </td>
                    <td>
                      <button onClick={() => confirmAction('deleteContent', item)} className="delete-button">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h2>Gestión de Comentarios</h2>
            <table>
              <caption>Lista de comentarios</caption>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Lugar</th>
                  <th>Comentario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.userName}</td>
                    <td>{comment.placeName}</td>
                    <td>{comment.content}</td>
                    <td>
                      <button onClick={() => confirmAction('deleteComment', comment)} className="delete-button">
                        Eliminar
                      </button>
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
            <h2>Confirmar acción</h2>
            <p>¿Estás seguro de que quieres realizar esta acción? Esta operación no se puede deshacer.</p>
            <div className="dialog-buttons">
              <button onClick={() => setIsDialogOpen(false)} className="cancel-button">Cancelar</button>
              <button onClick={executeAction} className="confirm-button">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
