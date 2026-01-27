import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    try {
        const response = await axios.get('https://qabsjgpxse.execute-api.eu-central-1.amazonaws.com/get-upload-url');
        const { uploadUrl } = response.data;

        // The PUT request must match the signature exactly
        await axios.put(uploadUrl, file, {
            headers: { 
                'Content-Type': 'image/jpeg' // Match what we put in Lambda
            }
        });

        alert('Upload Successful!');
    } catch (error) {
        // Log the actual response from S3 if possible
        console.error('Upload Error:', error.response ? error.response.data : error.message);
    } finally {
        setUploading(false);
    }
};

  return (
    <div className="upload-container">
      <h2>Share Your Moment</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Post to Feed'}
      </button>
    </div>
  );
};

export default Upload;