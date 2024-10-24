import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import Eventos from '../pages/Eventos';
import InformacionViajero from '../pages/InformacionViajero.js';
import Logo from '../styles/images/Logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <img src={Logo} alt="Logo" />
          </Link>
          <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
          <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
            <li><Link to="/">Inicio</Link></li>
            <li className="dropdown">
              <span>Descubre el Oriente</span>
              <ul className="dropdown-menu">
                <li><Link to="/Municipios">El Retiro</Link></li>
                <li><Link to="/la-ceja">La Ceja</Link></li>
                <li><Link to="/el-carmen">El Carmen</Link></li>
                <li><Link to="/la-union">La Unión</Link></li>
                <li><Link to="/rionegro">Rionegro</Link></li>
              </ul>
            </li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li><Link to="/informacion">Información al Viajero</Link></li>
            <li className="dropdown">
              <span>Idioma</span>
              <ul className="dropdown-menu">
                <li><button>Español</button></li>
                <li><button>English</button></li>
                <li><button>Français</button></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;