import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Upload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://qabsjgpxse.execute-api.eu-central-1.amazonaws.com'; 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file && !caption) return;
    setUploading(true);
    
    try {
      let imageUrl = null;

      if (file) {
        // Step A: Pass the real file type (e.g. image/png, image/webp)
        const response = await axios.get(`${API_BASE_URL}/get-upload-url`, {
          params: { contentType: file.type } 
        });
        
        const { uploadUrl, fileKey } = response.data;

        // Step B: Send the file with its native content-type
        await axios.put(uploadUrl, file, {
          headers: { 
            'Content-Type': file.type // THIS MUST MATCH STEP A
          }
        });
        
        imageUrl = `https://cloudgram-media-stnsc.s3.eu-central-1.amazonaws.com/${fileKey}`;
      }

      // Step 2: Create post metadata
      // The rest of the payload remains the same
      const postPayload = {
        userId: user.userId,
        username: user.username,
        caption: caption,
        imageUrl: imageUrl
      };

      await axios.post(`${API_BASE_URL}/create-post`, postPayload);
      
      alert('Post Published!');
      navigate('/');

    } catch (error) {
      console.error('Upload Error:', error);
      alert('Upload failed. See console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center' }}>Create Post</h2>
      
      {/* Text Area for Captions/Text Posts */}
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows="4"
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '8px',
            border: '1px solid #555',
            backgroundColor: '#333',
            color: '#fff',
            resize: 'vertical'
          }}
        />
      </div>

      {/* File Input for Images */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ width: '100%' }}
        />
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleUpload} 
        disabled={uploading} 
        style={{ 
          width: '100%', 
          padding: '10px', 
          fontSize: '1rem',
          backgroundColor: uploading ? '#555' : '#646cff',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Publishing...' : 'Post'}
      </button>
    </div>
  );
};

export default Upload;