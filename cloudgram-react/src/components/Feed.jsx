import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const {user} = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://qabsjgpxse.execute-api.eu-central-1.amazonaws.com'; 

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/feed`);
      
      // DynamoDB might return { Items: [...] } or just the array depending on your Lambda
      const data = res.data.Items || res.data;
      
      // Sort posts by timestamp (newest first)
      const sortedPosts = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.post(`${API_BASE_URL}/delete`, {
        postId: postId,
        userId: user.userId // Backend will verify ownership
      });

      // Optimistic UI: Remove from state immediately so it feels fast
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. You can only delete your own posts.");
    }
  };

  const handleLike = async (postId) => {
    // 1. Find the post and update UI immediately (Optimistic Update)
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.likes && post.likes.includes(user.userId);
        const newLikes = alreadyLiked 
          ? post.likes.filter(id => id !== user.userId) // Remove like
          : [...(post.likes || []), user.userId];       // Add like
        return { ...post, likes: newLikes };
      }
      return post;
    });
    setPosts(updatedPosts);

    // 2. Sync with the backend in the background
    try {
      await axios.post(`${API_BASE_URL}/like`, {
        postId: postId,
        userId: user.userId
      });
    } catch (err) {
      console.error("Like update failed:", err);
      // If the API fails, we should ideally fetchPosts() again to sync
    }
  };

  if (loading) return <div style={{ marginTop: '2rem' }}>Loading Feed...</div>;

  return (
    <div className="feed-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to share something!</p>
      ) : (
        posts.map((post) => {
          const isOwner = post.userId === user.userId;
          const isLiked = post.likes && post.likes.includes(user.userId);

          return (
            <div key={post.id} className="card" style={{ textAlign: 'left', marginBottom: '2rem', padding: '1.5rem' }}>
              
              {/* Header: User Info and Delete */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold', color: '#646cff' }}>@{post.username || 'Anonymous'}</span>
                {isOwner && (
                  <button 
                    onClick={() => handleDelete(post.id)}
                    style={{ backgroundColor: '#ff4d4d', padding: '4px 8px', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Media: Image (only if it exists) */}
              {post.imageUrl && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={post.imageUrl} 
                    alt="Post content" 
                    style={{ width: '100%', borderRadius: '8px', display: 'block' }} 
                  />
                </div>
              )}

              {/* Content: Caption */}
              {post.caption && (
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                  {post.caption}
                </p>
              )}

              {/* Footer: Interaction (Likes) */}
              <div style={{ borderTop: '1px solid #444', paddingTop: '10px', display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => handleLike(post.id)}
                  style={{ 
                    background: 'none', 
                    border: isLiked ? '1px solid #646cff' : '1px solid #555',
                    color: isLiked ? '#646cff' : '#fff',
                    marginRight: '10px',
                    padding: '5px 15px'
                  }}
                >
                  {isLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
                <span style={{ color: '#888' }}>
                  {post.likes ? post.likes.length : 0} likes
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Feed;