import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulating fetching data from DynamoDB via API Gateway
    const fetchPosts = async () => {
      // In a real scenario, this hits your "GetFeed" Lambda function
      const res = await axios.get('YOUR_API_GATEWAY_URL/feed');
      setPosts(res.data);
    };
    fetchPosts();
  }, []);


return (
  <div className="feed-grid">
    {/* Use Array.isArray to prevent crashes if the API returns an object */}
    {Array.isArray(posts) ? posts.map((post) => (
      <div key={post.id} className="card">
        <img src={post.imageUrl} alt="User content" loading="lazy" /> 
        <p>Posted by: {post.userId}</p>
      </div>
    )) : <p>No posts found or error loading data.</p>}
  </div>
);
};

export default Feed;