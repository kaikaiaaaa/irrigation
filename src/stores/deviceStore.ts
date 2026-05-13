import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Device, DeviceFormData } from '@/types/device';
import { EXPERT_RULES } from '@/types/device';

interface DeviceState {
  devices: Device[];
  addDevice: (data: DeviceFormData) => Device;
  updateDevice: (id: string, data: Partial<DeviceFormData>) => void;
  deleteDevice: (id: string) => void;
  getDeviceById: (id: string) => Device | undefined;
  updateSoilMoisture: (id: string, moisture: number) => void;
  markAsIrrigated: (id: string) => void;
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 创建演示数据
const createDemoDevices = (): Device[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'demo-1',
      name: '一号地块',
      location: { latitude: 31.2304, longitude: 121.4737, address: '上海市浦东新区' },
      cropType: '水稻',
      soilType: '壤土',
      area: 5,
      soilMoisture: 45,
      moistureThreshold: 60,
      lastIrrigationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-2',
      name: '二号地块',
      location: { latitude: 31.2304, longitude: 121.4737, address: '上海市浦东新区' },
      cropType: '小麦',
      soilType: '砂土',
      area: 3,
      soilMoisture: 35,
      moistureThreshold: 50,
      lastIrrigationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-3',
      name: '三号地块',
      location: { latitude: 31.2304, longitude: 121.4737, address: '上海市浦东新区' },
      cropType: '玉米',
      soilType: '粘土',
      area: 8,
      soilMoisture: 70,
      moistureThreshold: 55,
      lastIrrigationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      devices: createDemoDevices(),

      addDevice: (data: DeviceFormData) => {
        const now = new Date().toISOString();
        const expertRule = EXPERT_RULES.find(r => r.cropType === data.cropType);
        
        const newDevice: Device = {
          id: generateId(),
          ...data,
          soilMoisture: 50, // 默认初始湿度
          moistureThreshold: expertRule?.minMoisture ?? 50,
          lastIrrigationDate: null,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          devices: [...state.devices, newDevice],
        }));

        return newDevice;
      },

      updateDevice: (id: string, data: Partial<DeviceFormData>) => {
        const now = new Date().toISOString();
        set(state => ({
          devices: state.devices.map(device =>
            device.id === id
              ? { ...device, ...data, updatedAt: now }
              : device
          ),
        }));
      },

      deleteDevice: (id: string) => {
        set(state => ({
          devices: state.devices.filter(device => device.id !== id),
        }));
      },

      getDeviceById: (id: string) => {
        return get().devices.find(device => device.id === id);
      },

      updateSoilMoisture: (id: string, moisture: number) => {
        const now = new Date().toISOString();
        set(state => ({
          devices: state.devices.map(device =>
            device.id === id
              ? { ...device, soilMoisture: moisture, updatedAt: now }
              : device
          ),
        }));
      },

      markAsIrrigated: (id: string) => {
        const now = new Date().toISOString();
        set(state => ({
          devices: state.devices.map(device =>
            device.id === id
              ? { ...device, lastIrrigationDate: now, updatedAt: now }
              : device
          ),
        }));
      },
    }),
    {
      name: 'irrigation-devices',
      version: 1,
    }
  )
);
