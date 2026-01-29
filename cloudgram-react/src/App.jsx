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

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_ibviG0RCo', 
      userPoolClientId: '2q732dg9a5nhk34kcgi3arqe2' 
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