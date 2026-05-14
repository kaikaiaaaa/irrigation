export type CropType = '水稻' | '小麦' | '玉米' | '大豆' | '棉花' | '蔬菜';

export type SoilType = '砂土' | '壤土' | '粘土';

export interface Device {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  cropType: CropType;
  soilType: SoilType;
  area: number; // 单位：亩
  soilMoisture: number; // 当前土壤湿度百分比
  moistureThreshold: number; // 土壤湿度阈值百分比
  lastIrrigationDate: string | null; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface DeviceFormData {
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  cropType: CropType;
  soilType: SoilType;
  area: number;
  soilMoisture: number;
  moistureThreshold: number;
}

export const CROP_TYPES: CropType[] = ['水稻', '小麦', '玉米', '大豆', '棉花', '蔬菜'];

export const SOIL_TYPES: SoilType[] = ['砂土', '壤土', '粘土'];

// 作物生长阶段（v2 扩展）
export type GrowthStage = '苗期' | '分蘖期' | '拔节期' | '抽穗期' | '灌浆期' | '成熟期';

// 专家建议规则（v1 简化版）
export interface ExpertRule {
  cropType: CropType;
  minMoisture: number; // 最低土壤湿度要求
  maxMoisture: number; // 最高土壤湿度要求
  description: string;
}

// 预设的专家规则
export const EXPERT_RULES: ExpertRule[] = [
  { cropType: '水稻', minMoisture: 60, maxMoisture: 90, description: '水稻需保持较高湿度' },
  { cropType: '小麦', minMoisture: 50, maxMoisture: 80, description: '小麦生长期需适度湿润' },
  { cropType: '玉米', minMoisture: 55, maxMoisture: 85, description: '玉米需充足水分' },
  { cropType: '大豆', minMoisture: 50, maxMoisture: 80, description: '大豆耐旱性较好' },
  { cropType: '棉花', minMoisture: 45, maxMoisture: 75, description: '棉花需适度控水' },
  { cropType: '蔬菜', minMoisture: 60, maxMoisture: 85, description: '蔬菜需保持湿润' },
];

// 土壤保水特性
export interface SoilCharacteristic {
  type: SoilType;
  waterRetention: '低' | '中' | '高';
  drainage: '快' | '中' | '慢';
  description: string;
}

export const SOIL_CHARACTERISTICS: SoilCharacteristic[] = [
  { type: '砂土', waterRetention: '低', drainage: '快', description: '砂土保水性差，需频繁灌溉' },
  { type: '壤土', waterRetention: '中', drainage: '中', description: '壤土保水性适中，适合大多数作物' },
  { type: '粘土', waterRetention: '高', drainage: '慢', description: '粘土保水性好，注意排水防涝' },
];
