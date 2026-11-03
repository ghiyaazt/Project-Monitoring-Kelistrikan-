import { useState, useEffect } from 'react';
import { User } from '../../context/types';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../context/storage';

export const useUserManagement = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage(STORAGE_KEYS.USER, null)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, currentUser);
  }, [currentUser]);

  const setUser = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return {
    currentUser,
    setUser,
    logout
  };
};
