import type { Device } from '@/types/device';

export interface ExportData {
  version: string;
  exportDate: string;
  appName: string;
  devices: Device[];
}

export function exportDevices(devices: Device[]): void {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    appName: '放心灌',
    devices,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const date = new Date().toISOString().split('T')[0];
  const filename = `irrigation-data-${date}.json`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  success: boolean;
  devices: Device[];
  error?: string;
  warnings: string[];
}

export function validateImportData(data: unknown): ImportResult {
  const warnings: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { success: false, devices: [], error: '无效的数据格式', warnings };
  }

  const importData = data as Record<string, unknown>;
  
  if (!importData.devices || !Array.isArray(importData.devices)) {
    return { success: false, devices: [], error: '未找到设备数据', warnings };
  }

  const devices: Device[] = [];
  
  for (let i = 0; i < importData.devices.length; i++) {
    const item = importData.devices[i] as Record<string, unknown>;
    
    // 验证必需字段
    if (!item.id || typeof item.id !== 'string') {
      warnings.push(`第 ${i + 1} 个设备缺少ID，已跳过`);
      continue;
    }
    
    if (!item.name || typeof item.name !== 'string') {
      warnings.push(`第 ${i + 1} 个设备缺少名称，已跳过`);
      continue;
    }

    // 验证数值字段
    const soilMoisture = typeof item.soilMoisture === 'number' ? item.soilMoisture : 50;
    const moistureThreshold = typeof item.moistureThreshold === 'number' ? item.moistureThreshold : 60;
    const area = typeof item.area === 'number' ? item.area : 1;

    if (soilMoisture < 0 || soilMoisture > 100) {
      warnings.push(`第 ${i + 1} 个设备土壤湿度超出范围，已调整为50%`);
    }

    const location = typeof item.location === 'object' && item.location !== null ? item.location as Record<string, unknown> : {};
    
    const device: Device = {
      id: item.id,
      name: item.name,
      location: {
        latitude: typeof location['latitude'] === 'number' ? location['latitude'] : 31.2304,
        longitude: typeof location['longitude'] === 'number' ? location['longitude'] : 121.4737,
        address: typeof location['address'] === 'string' ? location['address'] : undefined,
      },
      cropType: ['水稻', '小麦', '玉米', '大豆', '棉花', '蔬菜'].includes(item.cropType as string) 
        ? (item.cropType as Device['cropType']) 
        : '水稻',
      soilType: ['砂土', '壤土', '粘土'].includes(item.soilType as string)
        ? (item.soilType as Device['soilType'])
        : '壤土',
      area: Math.max(0.1, area),
      soilMoisture: Math.max(0, Math.min(100, soilMoisture)),
      moistureThreshold: Math.max(0, Math.min(100, moistureThreshold)),
      lastIrrigationDate: typeof item.lastIrrigationDate === 'string' ? item.lastIrrigationDate : null,
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    devices.push(device);
  }

  if (devices.length === 0) {
    return { success: false, devices: [], error: '没有有效的设备数据', warnings };
  }

  return { success: true, devices, warnings };
}

export async function importDevices(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);
        resolve(validateImportData(data));
      } catch {
        resolve({ success: false, devices: [], error: '无效的JSON文件', warnings: [] });
      }
    };
    
    reader.onerror = () => {
      resolve({ success: false, devices: [], error: '文件读取失败', warnings: [] });
    };
    
    reader.readAsText(file);
  });
}
