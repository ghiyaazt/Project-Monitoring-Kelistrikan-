import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { iotDevices as initialIotDevices } from '../data/mockData';
import { IoTDevice } from '../data/mockData';

interface User {
  name: string;
  kamar: string;
  email: string;
  deviceId: string;
}

interface SmartWattWiseGroup {
  id: string;
  name: string;
  devices: string[];
  totalDaya: number;
}

interface AppContextType {
  currentUser: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  
  iotDevices: IoTDevice[];
  addDevice: (device: IoTDevice) => void;
  removeDevice: (deviceId: string) => void;
  updateDevice: (deviceId: string, updates: Partial<IoTDevice>) => void;
  
  groups: SmartWattWiseGroup[];
  addGroup: (group: Omit<SmartWattWiseGroup, 'id' | 'totalDaya'>) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (groupId: string, updates: Partial<SmartWattWiseGroup>) => void;
  
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'wattwise_user',
  DEVICES: 'wattwise_devices',
  GROUPS: 'wattwise_groups',
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or use default
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage(STORAGE_KEYS.USER, null)
  );
  
  const [iotDevices, setIotDevices] = useState<IoTDevice[]>(() =>
    loadFromStorage(STORAGE_KEYS.DEVICES, initialIotDevices)
  );
  
  const [groups, setGroups] = useState<SmartWattWiseGroup[]>(() =>
    loadFromStorage(STORAGE_KEYS.GROUPS, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DEVICES, iotDevices);
  }, [iotDevices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
  }, [groups]);

  const setUser = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const addDevice = (device: IoTDevice) => {
    setIotDevices(prev => [...prev, device]);
  };

  const removeDevice = (deviceId: string) => {
    setIotDevices(prev => prev.filter(d => d.id !== deviceId));
    setGroups(prev => prev.map(g => ({
      ...g,
      devices: g.devices.filter(id => id !== deviceId)
    })));
  };

  const updateDevice = (deviceId: string, updates: Partial<IoTDevice>) => {
    setIotDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, ...updates } : d
    ));
  };

  const addGroup = (group: Omit<SmartWattWiseGroup, 'id' | 'totalDaya'>) => {
    const newGroup: SmartWattWiseGroup = {
      ...group,
      id: `grp${Date.now()}`,
      totalDaya: group.devices.reduce((sum, deviceId) => {
        const device = iotDevices.find(d => d.id === deviceId);
        return sum + (device?.daya || 0);
      }, 0),
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const removeGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const updateGroup = (groupId: string, updates: Partial<SmartWattWiseGroup>) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const updatedGroup = { ...g, ...updates };
        if (updates.devices) {
          updatedGroup.totalDaya = updates.devices.reduce((sum, deviceId) => {
            const device = iotDevices.find(d => d.id === deviceId);
            return sum + (device?.daya || 0);
          }, 0);
        }
        return updatedGroup;
      }
      return g;
    }));
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.DEVICES);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    setCurrentUser(null);
    setIotDevices(initialIotDevices);
    setGroups([]);
  };

  const value: AppContextType = {
    currentUser,
    setUser,
    logout,
    iotDevices,
    addDevice,
    removeDevice,
    updateDevice,
    groups,
    addGroup,
    removeGroup,
    updateGroup,
    clearAllData,
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
