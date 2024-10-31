import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, Leaf } from "lucide-react";
import '../styles/Eventos.css';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
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

    fetchEvents();

    return () => eventos.forEach(event => {
      if (event.imageUrl) URL.revokeObjectURL(event.imageUrl);
    });
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500 text-white p-4 rounded">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ backgroundColor: 'white' }}>
      <header className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            className="text-6xl font-bold text-center mb-4"
            style={{fontSize:'3rem', color:'rgb(1, 70, 1)'}}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            Eventos en el Oriente Antioqueño
          </motion.h1>
          <motion.p
            className="text-2xl text-center"
            style={{padding:'30px', color:'rgb(1, 70, 1)'}}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            Vive lo extraordinario: Explora la esencia sostenible de Antioquia a través de experiencias que conectan con la naturaleza y la cultura local
          </motion.p>
        </div>
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 4 }}
          transition={{ duration: 1.5 }}
        >
          {[...Array(50)].map((_, i) => (
            <Leaf
              key={i}
              className="absolute opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 30 + 10}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                color: 'rgb(1, 70, 1)'
              }}
            />
          ))}
        </motion.div>
      </header>

      <main className="container mx-auto px-4 py-12 relative">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl" style={{color:'rgb(1, 70, 1)'}}>No hay eventos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento, index) => (
              <motion.div
                key={evento.Id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div 
                  className="h-96 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                  onClick={() => setSelectedEvent(evento)}
                >
                  <img
                    src={evento.imageUrl || '/placeholder.svg'}
                    alt={evento.Nombre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-2xl font-bold mb-2" style={{color:'rgb(1, 70, 1)'}}>{evento.Nombre}</h2>
                    <p className="line-clamp-2"
                    style={{paddingTop:'10px'}}>{evento.Descripcion}</p>
                    <div className="flex items-center gap-2 text-sm  mt-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>{evento.Comienza} - {evento.Termina}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className=" rounded-lg overflow-hidden max-w-2xl w-full" style={{backgroundColor:'rgb(1, 70, 1)'}}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedEvent.imageUrl || '/placeholder.svg'}
                alt={selectedEvent.Nombre}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-4" style={{color:'white'}}>{selectedEvent.Nombre}</h2>
                <p className=" mb-4" style={{color:'rgb(189, 247, 189)'}}>{selectedEvent.Descripcion}</p>
                <div className="flex items-center gap-2 text-sm mb-2" style={{paddingTop:'20px'}}>
                  <CalendarDays className="h-4 w-4" />
                  <span>{selectedEvent.Comienza} - {selectedEvent.Termina}</span>
                </div>
                {selectedEvent.Ubicacion && (
                  <div className="flex items-center gap-2 text-sm text-green-300 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEvent.Ubicacion}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Eventos;
