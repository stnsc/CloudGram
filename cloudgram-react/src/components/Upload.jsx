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
    
    // 1. Request a "Presigned URL" from your API Gateway (Serverless Pattern)
    // This aligns with "Pattern 3" to offload traffic from the main server
    try {
        const response = await axios.get('YOUR_API_GATEWAY_URL/get-upload-url'); 
        const { uploadUrl } = response.data;

        // 2. Upload directly to S3 (reduces latency)
        await axios.put(uploadUrl, file, {
            headers: { 'Content-Type': file.type }
        });
        alert('Upload Successful!');
    } catch (error) {
        console.error('Error uploading:', error);
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