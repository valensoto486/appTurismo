import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import './styles/App.css';
import Eventos from './pages/Eventos';
import InformacionViajero from './pages/InformacionViajero.js';
import EventoDetalle from './pages/EventoDetalle.js';
import Login from './pages/login.js';
import Register from './pages/register.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eventos" element={<Eventos /> } />
          <Route path="/informacion" element={<InformacionViajero />} />
          <Route path="/evento/:id" element={<EventoDetalle />} /> {/* Ruta para el detalle del evento */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;