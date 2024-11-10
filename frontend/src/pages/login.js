import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegistroLogin.css';

// Pagina de Login le realiza un POST a la funcion autenticarusuario 
// Envia en un JSON parametros correo y contrasenia
// La pagina Register se conecta directamente aca
// Al loguearse en el LocalStorage se guarda el token
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const userData = {
      correo: email,
      contrasenia: password,
    };
  
    try {
      const response = await fetch('https://autenticarusuario-jkomhrg5ba-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      // Primero, lee la respuesta como texto
      const textResponse = await response.text(); 
  
      // Luego verifica si la respuesta es un JSON válido
      let data;
      try {
        data = JSON.parse(textResponse); // Intenta convertir a JSON
      } catch (e) {
        // Si no es JSON, puedes manejarlo como un error
        alert(`Error: ${textResponse}`); // Muestra el mensaje de error
        return;
      }
  
      // Verifica si la respuesta indica éxito
      if (response.ok) {
        localStorage.setItem('authToken', data.Token); // Guardar el token
        localStorage.setItem('rol', data.rol); // Guarda el rol
        console.log(data); 
        alert(`Inicio de sesión exitoso!`);
        navigate('/'); // Redirigir a la página de inicio
      } else {
        // Si la autenticación falló, mostrar el mensaje de error
        alert(`Error: ${data.error || textResponse}`); // Muestra el mensaje de error, en caso de que no tenga clave 'error'
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
