// src/Welcome.js
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import './LoginSignup.css';

function Welcome() {

  const[action,setAction] = useState("Sign Up");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use this for redirecting

  const handleSignUp = async () => {
    try {
      // Send the POST request to the backend to create a user
      await axios.post('http://localhost:5194/api/users', {
        username,
        email,
        password,
      });

      // Redirect to the next screen (e.g., main app or login)
      navigate('/posts'); // Navigate to login page or wherever you want
    } catch (error) {
      console.error('Error creating user:', error);
      // You can display an error message here if needed
    }
  };

  return (
    <div className="container">
    <div className="header">
      <div className="text">{action}</div>
      <div className="underline"></div>
    </div>

    <div className="inputs">
      {action === "Login"?<div></div>:
       <div className="input">
       <input
      type="text"
      placeholder="Enter your username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
     </div>}
     

      <div className="input">
          <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      </div>

      <div className="input">
          <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      {action === "Sign Up" ? <div></div> : <div className="forgot-password">Lost Password? <span>Click Here!</span></div>}

      

      <div className="submit-container">
          {/* When "Sign up" is clicked, set action to "Login" */}
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={handleSignUp} // Call handleSignUp when clicked
          >
            Sign up
          </div>

          {/* When "Login" is clicked, set action to "Sign Up" */}
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => setAction("Login")}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
