import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegistroLogin.css';

// La pagina Register llama a la funcion crearusuario 
// la funcion crearusuario recibe un JSON y retorna un text/html
//Se accede a register desde la pagina login
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [setCargando] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCargando(true);
  
    // Crear el objeto con los datos del nuevo usuario
    const newUser = {
      nombre: username,
      correo: email,
      contrasenia: password,
      rol: 'usuario',
    };
  
    try {
      // Realizar la solicitud al backend para crear un nuevo usuario
      const response = await fetch('https://crearusuario-jkomhrg5ba-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      // Leer la respuesta como texto
      const data = await response.text(); // Leer la respuesta como texto
  
      console.log(data);
  
      if (response.ok) {
        // Intenta parsear el texto como JSON
        try {
          const jsonResponse = JSON.parse(data); // Intenta parsear el texto a JSON
          setMensaje(`Registro exitoso! Bienvenido, ${jsonResponse.nombre || username}`);
          navigate('/');
        } catch (jsonError) {
          // Si hay un error al parsear, manejarlo aquí
          setMensaje(`Registro exitoso! Bienvenido, ${username}`);
          navigate('/');
        }
      } else {
        // Manejar errores en el registro
        setMensaje(`Error: ${data}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setMensaje(`Hubo un error al intentar registrarse: ${error.message}`);
    }finally{
      setCargando(false); // Desactivar estado de carga
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
