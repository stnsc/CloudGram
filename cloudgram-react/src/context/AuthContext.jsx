import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
        const session = await fetchAuthSession();
        if (session && session.tokens && session.tokens.idToken) {
            const { username } = await getCurrentUser();
            const token = session.tokens.idToken.toString(); 
            const verified_sub = session.tokens.idToken.payload.sub;

            setUser({ 
                username, 
                userId: verified_sub, 
                token 
            });
        } else {
            setUser(null);
        }
    } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
    } finally {
        setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);