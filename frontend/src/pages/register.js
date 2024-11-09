import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegistroLogin.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHost, setIsHost] = useState(false); // Estado para el checkbox
  const [mensaje, setMensaje] = useState('');
  const [setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCargando(true);

    const newUser = {
      nombre: username,
      correo: email,
      contrasenia: password,
      rol: isHost ? 'anfitrion' : 'turista', // Asigna el rol según el checkbox
    };

    try {
      const response = await fetch('https://crearusuario-jkomhrg5ba-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.text();

      if (response.ok) {
        try {
          const jsonResponse = JSON.parse(data);
          setMensaje(`Registro exitoso! Bienvenido, ${jsonResponse.nombre || username}`);
          
          // Guarda el token en localStorage
          localStorage.setItem('authToken', 'tokenDeEjemplo'); 

          navigate('/'); // Redirige a Home
        } catch (jsonError) {
          setMensaje(`Registro exitoso! Bienvenido, ${username}`);
          
          // Guarda el token en localStorage
          localStorage.setItem('authToken', 'tokenDeEjemplo');

          navigate('/'); // Redirige a Home
        }
      } else {
        setMensaje(`Error: ${data}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setMensaje(`Hubo un error al intentar registrarse: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-contenedor">
      <h2>Registro</h2>
      {mensaje && <div className={mensaje.includes('exitoso') ? 'mensaje-exito' : 'mensaje-error'}>{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grupo-formulario">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="isHost">¿Desea promocionar un lugar?</label>
          <input
            id="isHost"
            type="checkbox"
            checked={isHost}
            onChange={(event) => setIsHost(event.target.checked)}
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
