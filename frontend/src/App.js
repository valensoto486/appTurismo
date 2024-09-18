import React from 'react'; 
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Asegúrate de incluir 'Link'
import './App.css';
import InfoViajero from './InfoViajero';
import Eventos from './Eventos';
import Inicio from './Inicio'; // Importa el componente Inicio

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>App Turismo</h1>
          <nav className="nav-bar">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/Eventos" className="nav-link">Descubre el oriente</Link>
            <Link to="/InfoViajero" className="nav-link">Información al viajero</Link>
            <Link to="/Eventos" className="nav-link">Eventos</Link>
          </nav>
        </header>

        {/* Imagen estática con frase y botón */}
        <div className="image-container">
          <img src="https://i.postimg.cc/pXxq4yK8/Whats-App-Image-2024-09-17-at-9-34-25-AM.jpg" alt="Banner" className="static-image" />
          <div className="overlay">
            <h2 className="overlay-text">Bienvenido al oriente antioqueño</h2>
            <button className="login-button">Iniciar Sesión</button>
          </div>
        </div>
        
        {/* Palabras sobre el oriente antioqueño */}
        <div className="palabras-container">
          <h2 className="text">Explora el mundo, pero no a costa del planeta. Viaja con conciencia, y descubre que el verdadero tesoro es la huella que dejas detras</h2>
          <h3 className="text">El turismo sostenible es una forma de viajar que equilibra la satisfacción de tus deseos de exploración con la necesidad de proteger el medio ambiente y respetar las culturas locales. Consiste en hacer elecciones conscientes que minimicen el impacto negativo en los destinos que visitas, como elegir alojamientos ecológicos, reducir el uso de plásticos y apoyar a empresas que promueven prácticas responsables. Así, tus viajes no solo enriquecen tu vida, sino que también contribuyen al bienestar de las comunidades y la conservación de los recursos naturales.</h3>
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Inicio />} /> {/* Cambia aquí a Inicio */}
            <Route path="/InfoViajero" element={<InfoViajero />} />
            <Route path="/Eventos" element={<Eventos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

