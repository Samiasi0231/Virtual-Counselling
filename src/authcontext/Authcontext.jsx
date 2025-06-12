
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
    const register = (userData) => {
      localStorage.setItem('lastUser', JSON.stringify(userData));
      setUser(userData);
    };


    const login = ({ email, password }) => {
      const saved = JSON.parse(localStorage.getItem('lastUser'));
    
      if (
        saved &&
        saved.email === email &&
        saved.password === password
      ) {
        setUser(saved);     
        return saved;        
      }
    
      return null; 
    };
    

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
