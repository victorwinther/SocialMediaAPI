import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Importing router components
import CreateUser from './CreateUser';
// Import your existing components or create new ones
import Welcome from './Welcome'; // The new Welcome component
import PostsPage from './PostsPage'; // The main posts page component



function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Welcome page */}
        <Route path="/" element={<Welcome />} />
        {/* Route for Posts page (main app) */}
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </Router>
  );

  
}


export default App;
