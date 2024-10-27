import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegistroLogin.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Crear el objeto con los datos de inicio de sesión
    const userData = {
      correo: email,
      contrasenia: password,
    };

    try {
      // Realizar la solicitud al backend
      const response = await fetch('https://autenticarusuario-jkomhrg5ba-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Si la autenticación fue exitosa, redirigir al usuario
        alert(`Inicio de sesión exitoso! Token: ${data.Token}`);
        navigate('/');
      } else {
        // Manejar errores en la autenticación
        alert(`Error: ${data}`);
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      alert('Hubo un error al intentar iniciar sesión');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Iniciar sesión</button>
        <Link to="/register" className="registro">¿No tienes cuenta? Regístrate</Link>
      </form>
    </div>
  );
}

export default Login;
