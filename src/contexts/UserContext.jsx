import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the User Context
const UserContext = createContext();

// Custom hook to use the User Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pokeindex_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Save to localStorage for persistence
    localStorage.setItem('pokeindex_user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // Remove from localStorage
    localStorage.removeItem('pokeindex_user');
  };

  // Update user data
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('pokeindex_user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;