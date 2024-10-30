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
import Rionegro from './pages/Rionegro.js';
import LaUnion from './pages/LaUnion.js';
import LaCeja from './pages/LaCeja.js';
import ElRetiro from './pages/ElRetiro.js';
import ElCarmen from './pages/ElCarmen.js';
import Dashboard from './pages/DashboardAdmin.js';
import PlaceDetails from './components/PlaceDetails.js';

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
          <Route path="/rionegro" element={<Rionegro />} />
          <Route path="/launion" element={<LaUnion />} />
          <Route path="/laceja" element={<LaCeja />} />
          <Route path="/elretiro" element={<ElRetiro />} />
          <Route path="/elcarmen" element={<ElCarmen />} />
          <Route path="/dashboardAdmin" element={<Dashboard />} />
          <Route path="/placedetails" element={<PlaceDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;