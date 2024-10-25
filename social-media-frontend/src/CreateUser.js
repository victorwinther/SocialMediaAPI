// src/CreateUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';


function CreateUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // To navigate after user creation

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5194/api/users', {
        username,
        email,
      });
      alert('User created successfully');
      navigate('/posts'); // Redirect to the main posts page
    } catch (err) {
      console.error('Error creating user', err);
    }
  };

  return (
    <div className="mainContainer">
      <h2>Create a New User</h2>
      <form onSubmit={handleCreateUser}>
        <div className={'titleContainer'}>
      </div>
      <br />
        <div className="inputContainer">
          <input
            type="text"
            className="inputBox"
            placeholder="Enter your username here"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="email"
            className="inputBox"
            value={email}
            placeholder='Enter your email here'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div className="formContainer">
        <button type="submit" className="btn btn-primary">Create User</button>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;
