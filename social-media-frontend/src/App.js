import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [posts, setPosts] = useState([]); // State to store the list of posts
  const [newPost, setNewPost] = useState(''); // State to handle new post content
  const [error, setError] = useState(null); // State to handle errors

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5194/api/posts');
        setPosts(response.data); // Update state with the list of posts
      } catch (err) {
        setError('There was an error fetching the posts!');
        console.error(err);
      }
    };

    fetchPosts(); // Call the function to fetch posts
  }, []);

  // Handle creating a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5194/api/posts', {
        content: newPost,
        userId: 1, // Assuming userId 1 is valid; this can be dynamic
      });
      setPosts([...posts, response.data]); // Add new post to the list
      setNewPost(''); // Clear input field
    } catch (err) {
      setError('There was an error creating the post!');
      console.error(err);
    }
  };
  
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5194/api/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('There was an error deleting the post!', err);
    }
  };

  const handleLikePost = async (postId,userId) => {
    try {
  
      // Send POST request to like the post
      await axios.post(`http://localhost:5194/api/likes/${postId}?userId=${userId}`);
  
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likeCount: (post.likeCount || 0) + 1 } // Add +1 to the existing likeCount
          : post
      ));
    } catch (err) {
      console.error('Error liking the post:', err);
    }
  };
  

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* ... */}
      </nav>
  
      {/* Post Feed */}
      <div className="container mt-4">
        <h1>Social Media Posts</h1>
        <form onSubmit={handleCreatePost} className="mb-4">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your post"
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Post</button>
        </form>
  
        {error && <p style={{ color: 'red' }}>{error}</p>}
  
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 mb-3" key={post.id}>
              <div className="card position-relative">
                {/* "X" button for removing the post */}
                  <button className="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onClick={() => handleDeletePost(post.id)}></button>
                  <div className="card-body">
                  <h5 className="card-title">User {post.userId}</h5>
                  <p className="card-text">{post.content}</p>
                   {/* Display the number of likes */}
                  <p>Likes: {post.likeCount}</p>
                {/* Like button */}
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleLikePost(post.id,1)}
                  disabled={post.userHasLiked}  // Disable if already liked
                >
                  Like
                </button>
                  <button className="btn btn-secondary">Comment</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}  
export default App;
