// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = cookies.token;

    if (token) {
      // Decode and verify the token on the client side
      // For simplicity, let's assume the token contains a 'userId' field
      const decodedToken = { userId: 'exampleUserId' }; // Replace with your decoding logic
      setUser(decodedToken);
    }
  }, [cookies.token]);

  const login = (token) => {
    setCookie('token', token, { path: '/' });
  };

  const logout = () => {
    removeCookie('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
