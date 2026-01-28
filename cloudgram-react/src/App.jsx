import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context & Protection
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Upload from './components/Upload';
import Auth from './components/Auth';

// 1. Import Amplify
import { Amplify } from 'aws-amplify';

// 2. Configure with your IDs
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_ibviG0RCo', // Paste your User Pool ID
      userPoolClientId: '2q732dg9a5nhk34kcgi3arqe2' // Paste your Client ID
    }
  }
});

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              {/* Public Route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Routes - These check if user exists in AuthContext */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;