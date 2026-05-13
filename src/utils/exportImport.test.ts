import { describe, it, expect, vi } from 'vitest';
import { exportDevices, validateImportData, importDevices } from '@/utils/exportImport';
import type { Device } from '@/types/device';

describe('数据导入导出', () => {
  const mockDevices: Device[] = [
    {
      id: 'test-1',
      name: '测试地块1',
      location: { latitude: 31.2304, longitude: 121.4737 },
      cropType: '水稻',
      soilType: '壤土',
      area: 5,
      soilMoisture: 50,
      moistureThreshold: 60,
      lastIrrigationDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('应导出数据为JSON格式', () => {
    // 创建一个模拟的URL.createObjectURL
    const mockUrl = 'blob:mock-url';
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl);
    globalThis.URL.revokeObjectURL = vi.fn();

    exportDevices(mockDevices);

    // 验证URL.createObjectURL被调用
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
  });

  it('应验证有效的导入数据', () => {
    const validData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      devices: mockDevices,
    };

    const result = validateImportData(validData);

    expect(result.success).toBe(true);
    expect(result.devices.length).toBe(1);
    expect(result.devices[0].name).toBe('测试地块1');
  });

  it('应拒绝无效的数据格式', () => {
    const result = validateImportData(null);

    expect(result.success).toBe(false);
    expect(result.error).toBe('无效的数据格式');
  });

  it('应拒绝缺少设备数据', () => {
    const result = validateImportData({ version: '1.0.0' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('未找到设备数据');
  });

  it('应处理部分无效的设备', () => {
    const data = {
      devices: [
        mockDevices[0],
        { id: 'test-2' }, // 缺少名称
      ],
    };

    const result = validateImportData(data);

    expect(result.success).toBe(true);
    expect(result.devices.length).toBe(1);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('应修复超出范围的土壤湿度', () => {
    const data = {
      devices: [{
        ...mockDevices[0],
        soilMoisture: 150, // 超出范围
      }],
    };

    const result = validateImportData(data);

    expect(result.success).toBe(true);
    expect(result.devices[0].soilMoisture).toBe(100);
  });
});
