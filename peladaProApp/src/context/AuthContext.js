import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onLoginSuccess = () => setIsAuthenticated(true);
  const onLogout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, onLoginSuccess, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
