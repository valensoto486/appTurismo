import React, { useState } from 'react';
import { BrowserRouter as  Link } from 'react-router-dom'; 
import './styles/RegistroLogin.css';
import './register';
import { useHistory } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulación de inicio de sesión exitoso
    alert(`Inicio de sesión exitoso! ${username} ${password}`);
    history.push('/app');
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <button type="submit">Iniciar sesión</button>
        <Link to="/register" className="registro">Si aun no tienes cuenta, registrate</Link>
        
      </form>
    </div>
  );
}

export default Login;