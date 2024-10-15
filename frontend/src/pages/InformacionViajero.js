import React from 'react';
import '../styles/InformacionViajero.css';

function InformacionViajero() {
  return (
    <div className="informacion-viajero-page">
      <header className="informacion-header">
        <div className="container">
          {/* <h1>Información al Viajero</h1> */}
        </div>
      </header>

      <main className="container">
        <section className="informacion-content">
          <h2>Antes de Viajar a Antioquia</h2>
          
          <div className="info-section">
            <h3>Políticas de Seguridad</h3>
            <p>
              Antioquia es generalmente segura para los turistas, pero te recomendamos seguir las precauciones habituales:
              mantén tus pertenencias cerca, evita mostrar objetos de valor y sé consciente de tu entorno, especialmente en áreas concurridas.
            </p>
          </div>

          <div className="info-section">
            <h3>Aspectos Culturales</h3>
            <p>
              Los antioqueños son conocidos por su calidez y hospitalidad. El respeto a las tradiciones locales y el medio ambiente es fundamental para el turismo sostenible.
              Aprende algunas frases en español para interactuar con los locales.
            </p>
          </div>

          <div className="info-section">
            <h3>Clima</h3>
            <p>
              Antioquia tiene un clima variado debido a su diversidad geográfica. En general, experimenta temperaturas templadas durante todo el año.
              Te recomendamos empacar ropa ligera y fresca, pero también incluir algunas prendas abrigadas para las noches más frescas o visitas a zonas de mayor altitud.
            </p>
          </div>

          <div className="info-section">
            <h3>Transporte</h3>
            <p>
              Antioquia cuenta con un sistema de transporte público bien desarrollado en las principales ciudades. Para visitar áreas rurales,
              considera alquilar un vehículo o unirte a tours organizados que promuevan prácticas de turismo sostenible.
            </p>
          </div>

          <div className="info-section">
            <h3>Salud</h3>
            <p>
              Asegúrate de tener un seguro de viaje que cubra emergencias médicas. Si planeas visitar áreas rurales o realizar actividades al aire libre,
              considera vacunarte contra la fiebre amarilla y llevar repelente de insectos.
            </p>
          </div>
        </section>

        <section className="informacion-imagen">
          <img
            src="/placeholder.svg?height=400&width=800"
            alt="Paisaje de Antioquia"
          />
        </section>
      </main>
    </div>
  );
}

export default InformacionViajero;