import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import './styles/App.css';
import InfoViajero from './InfoViajero';
import Eventos from './Eventos';
import Inicio from './Inicio'; 
import miImagen from './styles/images/img1.jpg';
import foto1 from './styles/images/Rionegro.jpg'; 
import foto2 from './styles/images/LaUnion.jpg';
import foto3 from './styles/images/ElCarmen.jpg';
import foto4 from './styles/images/ElRetiro.jpg';
import foto5 from './styles/images/LaCeja.jpg';


function App() {

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>App Turismo</h1>
          <nav className="nav-bar">
            <Link to="/" className="nav-link">Inicio</Link>
            <div 
              className="dropdown" 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <span id="descubre-text">Descubre el oriente</span>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/rionegro" className="dropdown-item">Rionegro</Link></li>
                  <li><Link to="/la-union" className="dropdown-item">La Unión</Link></li>
                  <li><Link to="/el-carmen" className="dropdown-item">El Carmen de Viboral</Link></li>
                  <li><Link to="/el-retiro" className="dropdown-item">El Retiro</Link></li>
                  <li><Link to="/la-ceja" className="dropdown-item">La Ceja</Link></li>
                </ul>
              )}
            </div>

            <Link to="/Eventos" className="nav-link">Eventos</Link>
            <Link to="/InfoViajero" className="nav-link">Información al viajero</Link>
          </nav>
        </header>

        {/* Imagen estática con frase y botón */}
        <div className="image-wrapper">
          <div className="image-container">
            <img
              src={miImagen}
              alt="Banner"
              className="static-image"
            />
            <div className="overlay">
              <h2 className="overlay-text">Bienvenido al oriente antioqueño</h2>
              <button className="login-button">Iniciar Sesión</button>
            </div>
          </div>
        </div>
        
        {/* Palabras sobre el oriente antioqueño */}
        <div className="palabras-container">
          <h2 className="text">Explora el mundo, pero no a costa del planeta. Viaja con conciencia, y descubre que el verdadero tesoro es la huella que dejas detras</h2>
          <h3 className="text">El turismo sostenible es una forma de viajar que equilibra la satisfacción de tus deseos de exploración con la necesidad de proteger el medio ambiente y respetar las culturas locales. Consiste en hacer elecciones conscientes que minimicen el impacto negativo en los destinos que visitas, como elegir alojamientos ecológicos, reducir el uso de plásticos y apoyar a empresas que promueven prácticas responsables. Así, tus viajes no solo enriquecen tu vida, sino que también contribuyen al bienestar de las comunidades y la conservación de los recursos naturales.</h3>
        </div>

        {/* DESCUBRE EL ORIENTE son btn */}
        <div className="gallery-container">
          <h2 className="gallery-title">Descubre el Oriente Antioqueño </h2>
          <div className="gallery">
            <div className="gallery-item">
              <button onClick={() => alert('Imagen 1 clickeada!')}>
                <img src={foto1} alt="Foto 1" className="gallery-image" />
              </button>
              <h3 className="gallery-item-title">Rionegro</h3>
            </div>
            <div className="gallery-item">
              <button onClick={() => alert('Imagen 2 clickeada!')}>
                <img src={foto2} alt="Foto 2" className="gallery-image" />
              </button>
              <h3 className="gallery-item-title">La Union</h3>
            </div>
            <div className="gallery-item">
              <button onClick={() => alert('Imagen 3 clickeada!')}>
                <img src={foto3} alt="Foto 3" className="gallery-image" />
              </button>
              <h3 className="gallery-item-title">El Carmen de Viboral</h3>
            </div>
            <div className="gallery-item">
              <button onClick={() => alert('Imagen 4 clickeada!')}>
                <img src={foto4} alt="Foto 4" className="gallery-image" />
              </button>
              <h3 className="gallery-item-title">El Retiro</h3>
            </div>
            <div className="gallery-item">
              <button onClick={() => alert('Imagen 5 clickeada!')}>
                <img src={foto5} alt="Foto 5" className="gallery-image" />
              </button>
              <h3 className="gallery-item-title">La Ceja </h3>
            </div>
          </div>
        </div>

        {/* EVENTOS */}
        <div className="eventos-container">
          <h2 className="eventos-title">Eventos </h2>
          <div className="eventos">
            <div className="eventos-item">
              <button onClick={() => alert('Imagen 1 clickeada!')}>
                <img src={foto1} alt="Foto 1" className="eventos-image" />
              </button>
              <h3 className="eventos-item-title">Evento 0</h3>
            </div>
            <div className="eventos-item">
              <button onClick={() => alert('Imagen 2 clickeada!')}>
                <img src={foto2} alt="Foto 2" className="eventos-image" />
              </button>
              <h3 className="eventos-item-title">Evento 1</h3>
            </div>
            <div className="eventos-item">
              <button onClick={() => alert('Imagen 3 clickeada!')}>
                <img src={foto3} alt="Foto 3" className="eventos-image" />
              </button>
              <h3 className="eventos-item-title">Evento 2</h3>
            </div>
            <div className="eventos-item">
              <button onClick={() => alert('Imagen 4 clickeada!')}>
                <img src={foto4} alt="Foto 4" className="eventos-image" />
              </button>
              <h3 className="eventos-item-title">Evento 3</h3>
            </div>
          </div>
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

