import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [contents, setContents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [date, setDate] = useState(new Date());

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      title: e.target.title.value,
      description: e.target.description.value,
      date: date
    };
    setEvents([...events, newEvent]);
    e.target.reset();
    setDate(new Date());
  };

  const handleModifyEvent = (e) => {
    e.preventDefault();
    const updatedEvents = events.map(event =>
      event.id === selectedEvent.id ? {
        ...event,
        title: e.target.title.value,
        description: e.target.description.value,
        date: date
      } : event
    );
    setEvents(updatedEvents);
    setSelectedEvent(null);
    e.target.reset();
    setDate(new Date());
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
    setSelectedEvent(null);
  };

  const handleCreateContent = (e) => {
    e.preventDefault();
    const newContent = {
      id: Date.now(),
      title: e.target.title.value,
      body: e.target.body.value
    };
    setContents([...contents, newContent]);
    e.target.reset();
  };

  const handleDeleteContent = (id) => {
    setContents(contents.filter(content => content.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Administración</h1>
      <div className="w-full">
        <div className="grid w-full grid-cols-2 mb-4">
          <button className="tabs-trigger" onClick={() => setSelectedEvent(null)}>Eventos</button>
          <button className="tabs-trigger" onClick={() => setSelectedEvent(null)}>Contenido</button>
        </div>
        <div className="tabs-content">
          {/* Eventos */}
          <div>
            <h2 className="font-bold">Gestión de Eventos</h2>
            <p>Crea, modifica y elimina eventos para tu sitio de turismo sostenible.</p>
            <form onSubmit={selectedEvent ? handleModifyEvent : handleCreateEvent} className="space-y-4">
              <div>
                <label htmlFor="title">Título del Evento</label>
                <input id="title" defaultValue={selectedEvent?.title} required />
              </div>
              <div>
                <label htmlFor="description">Descripción</label>
                <textarea id="description" defaultValue={selectedEvent?.description} required />
              </div>
              <div>
                <label>Fecha del Evento</label>
                <div>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setDate(new Date())}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
                  </button>
                </div>
              </div>
              <button type="submit">{selectedEvent ? 'Modificar Evento' : 'Crear Evento'}</button>
            </form>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Eventos Existentes</h3>
              {events.map(event => (
                <div key={event.id} className="event-card mb-2">
                  <h4>{event.title}</h4>
                  <p>{format(new Date(event.date), "PPP")}</p>
                  <p>{event.description}</p>
                  <div className="flex justify-end mt-2">
                    <button onClick={() => setSelectedEvent(event)}>Modificar</button>
                    <button onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contenido */}
          <div>
            <h2 className="font-bold">Gestión de Contenido</h2>
            <p>Crea y elimina contenido para tu sitio de turismo sostenible.</p>
            <form onSubmit={handleCreateContent} className="space-y-4">
              <div>
                <label htmlFor="contentTitle">Título del Contenido</label>
                <input id="contentTitle" name="title" required />
              </div>
              <div>
                <label htmlFor="contentBody">Cuerpo del Contenido</label>
                <textarea id="contentBody" name="body" required />
              </div>
              <button type="submit">Crear Contenido</button>
            </form>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Contenido Existente</h3>
              {contents.map(content => (
                <div key={content.id} className="content-card mb-2">
                  <h4>{content.title}</h4>
                  <p>{content.body}</p>
                  <div className="flex justify-end mt-2">
                    <button onClick={() => handleDeleteContent(content.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
