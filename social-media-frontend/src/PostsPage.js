import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';  // Solid heart icon
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';  // Regular (outline) heart icon


function App() {
  const [posts, setPosts] = useState([]); // State to store the list of posts
  const [newPost, setNewPost] = useState(''); // State to handle new post content
  const [error, setError] = useState(null); // State to handle errors
  const [commentVisibility, setCommentVisibility] = useState({}); // To toggle comment input visibility
  const [commentText, setCommentText] = useState({}); // To track the comment text for each post


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

  const handleLikePost = async (postId, userId) => {
    try {
      await axios.post(`http://localhost:5194/api/likes/${postId}?userId=${userId}`);
      
      // Update the post in the state with the incremented likeCount
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likeCount: (post.likeCount || 0) + 1, userHasLiked: true } // Increment likeCount and mark as liked
          : post
      ));
    } catch (err) {
      console.error('Error liking the post:', err);
    }
  };


  // Handle unliking a post
  const handleUnlikePost = async (postId, userId) => {
    try {
      await axios.delete(`http://localhost:5194/api/likes/${postId}/unlike?userId=${userId}`);
      // Update the post in the state with the decremented likeCount
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likeCount: (post.likeCount || 0) - 1, userHasLiked: false } // Decrement likeCount and mark as unliked
          : post
      ));
    } catch (err) {
      console.error('Error unliking the post:', err);
    }
  };
  const handleToggleComment = (postId) => {
    setCommentVisibility(prevState => ({
      ...prevState,
      [postId]: !prevState[postId] // Toggle visibility for the specific post
    }));
  };

  const handleCommentInputChange = (postId, text) => {
    setCommentText(prevState => ({
      ...prevState,
      [postId]: text // Track the comment text for the specific post
    }));
  };

  const handleCommentSubmit = (postId) => {

    try{
      const response = axios.post(`http://localhost:5194/api/comments/${postId}?userId=1`, {
        content: commentText[postId],
        userId: 1, // Assuming userId 1 is valid; this can be dynamic
        
      });
        // Update the posts state to include the new comment
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, response.data] } // Add the new comment to the post's comments
          : post
      ));
      
      // Clear the comment input for that post
      setCommentText(prevState => ({
        ...prevState,
        [postId]: '' // Clear the comment input field
      }));

    } catch (err) {
      console.error('Error unliking the post:', err);
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
                  className="btn btn-primary me-2" 
                 onClick={() => post.userHasLiked ? handleUnlikePost(post.id, 1) : handleLikePost(post.id, 1)}
                  >
                  {/* Toggle between solid heart if liked, regular heart if not */}
              <FontAwesomeIcon icon={post.userHasLiked ? fasHeart : farHeart} />
                </button>
                  <button className="btn btn-secondary"
                 onClick={() => handleToggleComment(post.id)}>
                 Comment
               </button>

               {/* Display comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-2">
                {post.comments.map((comment) => (
                  <div key={comment?.id} className="comment-box">
                    <strong>User {comment.userId}</strong>: {comment.content}
                  </div>
                ))}
              </div>
            )}
               
               {/* Show the input field only if commentVisibility is true for that post */}
               {commentVisibility[post.id] && (
                 <div className="mt-2">
                   <input 
                     type="text"
                     className="form-control mb-2"
                     placeholder="Write a comment..."
                     value={commentText[post.id] || ''} // Handle undefined cases
                     onChange={(e) => handleCommentInputChange(post.id, e.target.value)} // Update comment text
                     onKeyPress={(e) => {
                       if (e.key === 'Enter') {
                         handleCommentSubmit(post.id);
                       }
                     }}
                   />
                   <button className="btn btn-primary" onClick={() => handleCommentSubmit(post.id)}>Post</button>
                 </div>
               )}
               
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
