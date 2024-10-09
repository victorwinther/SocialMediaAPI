import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]); // State to store the list of posts
  const [error, setError] = useState(null); // State to handle errors

  // Use useEffect to fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5194/api/posts'); // Make the GET request to your API
        setPosts(response.data); // Update state with the list of posts
      } catch (err) {
        setError('There was an error fetching the posts!'); // Handle errors
        console.error(err);
      }
    };

    fetchPosts(); // Call the function to fetch posts
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className="App">
      <h1>Social Media Posts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
