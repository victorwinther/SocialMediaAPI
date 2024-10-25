// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple login logic (you can expand this with real authentication)
    if (username) {
      alert('Logged in successfully');
      navigate('/posts'); // Redirect to the main posts page
    } else {
      alert('Please enter a username');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="mb-3">
        <label>Username:</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
