import React, { useState } from 'react';
import { signUp, signIn, confirmSignUp } from 'aws-amplify/auth'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Added password state
  const [confirmationCode, setConfirmationCode] = useState(''); // For email verification
  const [isConfirming, setIsConfirming] = useState(false); // UI toggle
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { isSignedIn, userId } = await signIn({
          username: username,
          password: password,
        });

        if (isSignedIn) {
          login({ username: username, userId: userId });
          navigate('/');
        }
      } else if (isConfirming) {
        // --- VERIFICATION LOGIC ---
        await confirmSignUp({
          username: username,
          confirmationCode: confirmationCode
        });
        alert("Account verified! You can now log in.");
        setIsConfirming(false);
        setIsLogin(true);
      } else {
        // --- SIGNUP LOGIC ---
        const { nextStep } = await signUp({
          username: username,
          password: password,
          options: {
            userAttributes: { email: email }
          }
        });

        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          setIsConfirming(true);
        } else {
          alert("Signup successful!");
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2>{isConfirming ? 'Verify Email' : (isLogin ? 'Login' : 'Sign Up')}</h2>
      <form onSubmit={handleSubmit}>
        {!isConfirming && (
          <>
            {!isLogin && (
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
              />
            )}
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            />
          </>
        )}

        {isConfirming && (
          <input 
            type="text" 
            placeholder="6-Digit Code" 
            value={confirmationCode} 
            onChange={(e) => setConfirmationCode(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
          />
        )}

        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
          {isConfirming ? 'Verify' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </form>
      
      {!isConfirming && (
        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: '#646cff', marginTop: '1rem' }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      )}
    </div>
  );
};

export default Auth;