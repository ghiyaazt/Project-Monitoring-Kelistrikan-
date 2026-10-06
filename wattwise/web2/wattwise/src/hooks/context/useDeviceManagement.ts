import { useState, useEffect } from 'react';
import { IoTDevice } from '../../data/mockData';
import { iotDevices as initialIotDevices } from '../../data/mockData';
import { SmartWattWiseGroup } from '../../context/types';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../context/storage';

export const useDeviceManagement = () => {
  const [iotDevices, setIotDevices] = useState<IoTDevice[]>(() =>
    loadFromStorage(STORAGE_KEYS.DEVICES, initialIotDevices)
  );
  
  const [groups, setGroups] = useState<SmartWattWiseGroup[]>(() =>
    loadFromStorage(STORAGE_KEYS.GROUPS, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DEVICES, iotDevices);
  }, [iotDevices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
  }, [groups]);

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

  return {
    iotDevices,
    groups,
    addDevice,
    removeDevice,
    updateDevice,
    addGroup,
    removeGroup,
    updateGroup
  };
};
