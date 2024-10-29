import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import Logo from '../styles/images/Logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar rol admin
  const navigate = useNavigate();

  // Función para verificar el estado de autenticación y el rol al cargar el componente
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole'); // Obtener rol
    setIsAuthenticated(!!token);
    setIsAdmin(role === 'admin'); // Verificar si es admin
  };

  // useEffect para comprobar la autenticación al montar el componente
  useEffect(() => {
    checkAuth(); // Verificar autenticación al iniciar
  }, []);

  // useEffect para actualizar la autenticación en tiempo real
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth(); // Comprobar autenticación si hay un cambio en localStorage
    };

    window.addEventListener('storage', handleStorageChange); // Escuchar cambios en el almacenamiento

    return () => {
      window.removeEventListener('storage', handleStorageChange); // Limpiar el evento al desmontar
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); // Limpiar el rol al cerrar sesión
    checkAuth(); // Actualiza el estado de autenticación
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev); // Alternar el estado del menú desplegable
  };

  // Cerrar el menú desplegable al hacer clic fuera
  const handleClickOutside = (event) => {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu && !userMenu.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
                <li><Link to="/elretiro">El Retiro</Link></li>
                <li><Link to="/laceja">La Ceja</Link></li>
                <li><Link to="/elcarmen">El Carmen</Link></li>
                <li><Link to="/launion">La Unión</Link></li>
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

          {/* Ícono de usuario que despliega el menú */}
          {isAuthenticated && (
            <div className="user-menu">
              <button onClick={toggleDropdown} className="user-icon">
                👤 {/* Puedes usar una imagen o un ícono de tu elección */}
              </button>
              {isOpen && (
                <div className="dropdown-menu">
                  {isAdmin && (
                    <Link to="/dashboardAdmin" className="dropdown-item">Dashboard</Link>
                  )}
                  <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

