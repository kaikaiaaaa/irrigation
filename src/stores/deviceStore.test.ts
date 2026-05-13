import { describe, it, expect } from 'vitest';
import { useDeviceStore } from '@/stores/deviceStore';

describe('设备状态管理', () => {
  it('应添加设备', () => {
    const store = useDeviceStore.getState();
    const initialCount = store.devices.length;

    const newDevice = store.addDevice({
      name: '新测试地块',
      location: { latitude: 31.2304, longitude: 121.4737 },
      cropType: '水稻',
      soilType: '壤土',
      area: 5,
      moistureThreshold: 60,
    });

    expect(newDevice).toBeDefined();
    expect(newDevice.name).toBe('新测试地块');
    expect(useDeviceStore.getState().devices.length).toBe(initialCount + 1);
  });

  it('应更新设备', () => {
    const store = useDeviceStore.getState();
    const device = store.devices[0];

    store.updateDevice(device.id, { name: '更新后的名称' });

    const updated = useDeviceStore.getState().getDeviceById(device.id);
    expect(updated?.name).toBe('更新后的名称');
  });

  it('应删除设备', () => {
    const store = useDeviceStore.getState();
    const initialCount = store.devices.length;
    const device = store.devices[0];

    store.deleteDevice(device.id);

    expect(useDeviceStore.getState().devices.length).toBe(initialCount - 1);
    expect(useDeviceStore.getState().getDeviceById(device.id)).toBeUndefined();
  });

  it('应更新土壤湿度', () => {
    const store = useDeviceStore.getState();
    const device = store.devices[0];
    const newMoisture = 75;

    store.updateSoilMoisture(device.id, newMoisture);

    const updated = useDeviceStore.getState().getDeviceById(device.id);
    expect(updated?.soilMoisture).toBe(newMoisture);
  });

  it('应标记为已灌溉', () => {
    const store = useDeviceStore.getState();
    const device = store.devices[0];

    store.markAsIrrigated(device.id);

    const updated = useDeviceStore.getState().getDeviceById(device.id);
    expect(updated?.lastIrrigationDate).toBeTruthy();
  });
});
