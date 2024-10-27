import React, { useState } from 'react';
import '../styles/RegistroLogin.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Crear el objeto con los datos del nuevo usuario
    const newUser = {
      nombre: username,
      correo: email,
      contrasenia: password,
      rol: 'usuario',  // Puedes ajustar el rol según tus necesidades
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

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso
        alert(`Registro exitoso! Bienvenido, ${username}`);
        // Aquí puedes redirigir al usuario a la página de inicio de sesión o a otra página
      } else {
        // Manejar errores en el registro
        alert(`Error: ${data}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Hubo un error al intentar registrarte');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <br />
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
