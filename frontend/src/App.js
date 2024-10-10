import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import './styles/App.css';
import Eventos from './pages/Eventos';
import InformacionViajero from './pages/InformacionViajero.js';
import EventoDetalle from './pages/EventoDetalle.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eventos" element={Eventos} />
          <Route path="/informacion" component={InformacionViajero} />
          <Route path="/evento/:id" element={<EventoDetalle />} /> {/* Ruta para el detalle del evento */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;