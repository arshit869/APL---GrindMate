import React, { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext(null);

// Default to Arshit_Grind for demo
const DEFAULT_USER = {
  id: 'u1',
  name: 'Arshit_Grind',
  fitScore: 847,
  tier: 'Diamond',
  streak: 14,
  squadId: 's1',
  goalType: 'Strength',
  favoriteWorkout: 'Gym',
  goals: { daily: 100, type: 'runs' },
  todayProgress: 82,
  badges: ['Beast Mode', 'Consistency King', 'Challenge Crusher'],
  funnyTitle: 'Oracle',
  coins: 2450,
  joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const loginAsDemo = useCallback(() => {
    setUser(DEFAULT_USER);
    setIsLoggedIn(true);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_USER);
    setIsLoggedIn(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, loginAsDemo, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
