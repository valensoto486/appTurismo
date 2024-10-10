import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Acerca de Nosotros</h3>
            <p>Somos una organización dedicada a promover el turismo sostenible en Antioquia, Colombia.</p>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <p>Email: info@turismosostenibleantioquia.com</p>
            <p>Teléfono: +57 123 456 7890</p>
          </div>
          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">TW</a>
              <a href="#" className="social-icon">IG</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Turismo Sostenible Antioquia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;