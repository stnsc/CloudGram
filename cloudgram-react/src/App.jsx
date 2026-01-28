import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Upload from './components/Upload';

function App() {
  // SIMULATED AUTHENTICATION
  // In the future, this will come from AWS Cognito
  const [user, setUser] = useState({
    userId: 'user_123',
    username: 'VladGeorge'
  });

  return (
    <Router>
      <div className="app-container">
        {/* Pass user info to Navbar so we can show "Welcome, Vlad" */}
        <Navbar user={user} />
        
        <div className="content">
          <Routes>
            {/* Pass user info to Feed for Likes/Delete logic */}
            <Route path="/" element={<Feed user={user} />} />
            
            {/* Pass user info to Upload for post ownership */}
            <Route path="/upload" element={<Upload user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;