import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { jwtDecode } from 'jwt-decode';
import Logo from '../styles/images/Logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setUserRole] = useState(null); // Estado para almacenar el rol
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);

    if (token) {
      try {
        // Decodifica el JWT para extraer la información
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // Verifica si el token contiene el rol
        const userRole = decodedToken.rol; // Asume que 'rol' está en el token

        if (userRole) {
          setIsAuthenticated(true);
          setUserRole(userRole); // Establece el rol desde el token
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    checkAuth();
    navigate('/');
  };


  // Inicializa Google Translate cuando el script se carga
  useEffect(() => {
    if (!document.getElementById('google_translate_script')) {
      const googleTranslateScript = document.createElement('script');
      googleTranslateScript.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
      googleTranslateScript.id = 'google_translate_script';
      document.body.appendChild(googleTranslateScript);
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'es', includedLanguages: 'es,en,fr' },
        'google_translate_element'
      );
    };
  }, []);

  const handleLanguageChange = (language) => {
    const translateElement = document.getElementById('google_translate_element');
    if (translateElement) {
      const selectElement = translateElement.getElementsByTagName('select')[0];
      selectElement.value = language;
      selectElement.dispatchEvent(new Event('change'));
    }
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
                <li><button onClick={() => handleLanguageChange('es')}>Español</button></li>
                <li><button onClick={() => handleLanguageChange('en')}>English</button></li>
                <li><button onClick={() => handleLanguageChange('fr')}>Français</button></li>
              </ul>
            </li>

            {isAuthenticated && rol === 'admin' && (
              <div className="admin-menu">
                <Link to="/dashboard" className="dashboard-button">
                  Dashboard
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="user-menu">
                <button className="logout-button" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </ul>
        </nav>
        {/* Div para Google Translate */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
      </div>
    </header>
  );
};

export default Header;
