import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
// import Eventos from '../pages/Eventos';
// import InformacionViajero from '../pages/InformacionViajero.js';
import Logo from '../styles/images/Logo.png';
import Usuario from '../styles/images/usuario.png'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ha iniciado sesión
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Cerrar sesión: elimina el token y el nombre de usuario de localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    setIsUserMenuOpen(false);
    navigate('/'); // Redirige al usuario a la página de inicio de sesión
  };


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

          {/* Icono superior derecho 
           Aparece solo cuando la peersona ha iniciado sesion 
           Da la opcion de cerrar sesion en el menu desplegable */}
          {isAuthenticated && (
            <div className="user-menu">
              <img 
                src={Usuario} 
                alt="User Icon" 
                className="user-icon" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
              />
              <span className="username">{username}</span>
              {isUserMenuOpen && (
                <ul className="user-dropdown">
                  <li onClick={handleLogout}>Cerrar sesión</li>
                </ul>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;