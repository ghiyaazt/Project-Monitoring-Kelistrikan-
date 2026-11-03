import { createContext, useContext, ReactNode } from 'react';
import { AppContextType } from './types';
import { STORAGE_KEYS } from './storage';
import {
  useUserManagement,
  useDeviceManagement,
  useKosManagement,
  usePerangkatManagement,
  useThemeManagement
} from '../hooks/context';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // User management
  const { currentUser, setUser, logout } = useUserManagement();
  
  // Device management
  const {
    iotDevices,
    groups,
    addDevice,
    removeDevice,
    updateDevice,
    addGroup,
    removeGroup,
    updateGroup
  } = useDeviceManagement();
  
  // Kos management
  const {
    kosList,
    addKos,
    removeKos,
    updateKos,
    addKamarToKos,
    updateKamarInKos,
    deleteKamarFromKos
  } = useKosManagement();
  
  // Perangkat management
  const {
    perangkatList,
    addPerangkat,
    removePerangkat
  } = usePerangkatManagement();
  
  // Theme management
  const {
    themeMode,
    setThemeMode,
    effectiveTheme
  } = useThemeManagement();

  // Clear all data utility
  const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    window.location.reload(); // Reload to reinitialize all hooks
  };

  const value: AppContextType = {
    // User
    currentUser,
    setUser,
    logout,
    
    // IoT Devices
    iotDevices,
    addDevice,
    removeDevice,
    updateDevice,
    
    // Groups
    groups,
    addGroup,
    removeGroup,
    updateGroup,
    
    // Kos
    kosList,
    addKos,
    removeKos,
    updateKos,
    addKamarToKos,
    updateKamarInKos,
    deleteKamarFromKos,
    
    // Perangkat
    perangkatList,
    addPerangkat,
    removePerangkat,
    
    // Theme
    themeMode,
    setThemeMode,
    effectiveTheme,
    
    // Utilities
    clearAllData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Re-export types for convenience
export type { User, Penghuni, Payment, Kamar, Kos, Perangkat } from './types';
