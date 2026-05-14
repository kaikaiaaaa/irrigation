export type CropType = '水稻' | '小麦' | '玉米' | '大豆' | '棉花' | '蔬菜';

export type SoilType = '砂土' | '壤土' | '粘土';

export type GrowthStage = '苗期' | '分蘖期' | '拔节期' | '抽穗期' | '灌浆期' | '成熟期';

export const CROP_TYPES: CropType[] = ['水稻', '小麦', '玉米', '大豆', '棉花', '蔬菜'];

export const SOIL_TYPES: SoilType[] = ['砂土', '壤土', '粘土'];

export const GROWTH_STAGES: GrowthStage[] = ['苗期', '分蘖期', '拔节期', '抽穗期', '灌浆期', '成熟期'];

// 作物各生育期的需水系数（相对需水量）
export interface CropWaterNeed {
  cropType: CropType;
  stage: GrowthStage;
  minMoisture: number; // 最低土壤湿度%
  maxMoisture: number; // 最高土壤湿度%
  waterNeed: number; // 相对需水系数 0.5-1.5
  description: string;
}

// 作物生育期需水规则
export const CROP_WATER_NEEDS: CropWaterNeed[] = [
  // 水稻
  { cropType: '水稻', stage: '苗期', minMoisture: 70, maxMoisture: 90, waterNeed: 0.8, description: '苗期保持浅水层' },
  { cropType: '水稻', stage: '分蘖期', minMoisture: 80, maxMoisture: 95, waterNeed: 1.2, description: '分蘖期需水量大' },
  { cropType: '水稻', stage: '拔节期', minMoisture: 75, maxMoisture: 90, waterNeed: 1.3, description: '拔节期需充足水分' },
  { cropType: '水稻', stage: '抽穗期', minMoisture: 80, maxMoisture: 95, waterNeed: 1.4, description: '抽穗期需水量最大' },
  { cropType: '水稻', stage: '灌浆期', minMoisture: 70, maxMoisture: 85, waterNeed: 1.0, description: '灌浆期保持湿润' },
  { cropType: '水稻', stage: '成熟期', minMoisture: 50, maxMoisture: 70, waterNeed: 0.6, description: '成熟期适当控水' },
  
  // 小麦
  { cropType: '小麦', stage: '苗期', minMoisture: 55, maxMoisture: 75, waterNeed: 0.7, description: '苗期适度湿润' },
  { cropType: '小麦', stage: '分蘖期', minMoisture: 60, maxMoisture: 80, waterNeed: 0.9, description: '分蘖期增加供水' },
  { cropType: '小麦', stage: '拔节期', minMoisture: 65, maxMoisture: 80, waterNeed: 1.1, description: '拔节期需水增加' },
  { cropType: '小麦', stage: '抽穗期', minMoisture: 70, maxMoisture: 85, waterNeed: 1.3, description: '抽穗期需充足水分' },
  { cropType: '小麦', stage: '灌浆期', minMoisture: 60, maxMoisture: 75, waterNeed: 1.0, description: '灌浆期保持湿润' },
  { cropType: '小麦', stage: '成熟期', minMoisture: 45, maxMoisture: 60, waterNeed: 0.5, description: '成熟期控水促熟' },
  
  // 玉米
  { cropType: '玉米', stage: '苗期', minMoisture: 50, maxMoisture: 70, waterNeed: 0.6, description: '苗期适度控水' },
  { cropType: '玉米', stage: '分蘖期', minMoisture: 55, maxMoisture: 75, waterNeed: 0.8, description: '分蘖期增加供水' },
  { cropType: '玉米', stage: '拔节期', minMoisture: 60, maxMoisture: 80, waterNeed: 1.2, description: '拔节期需水量大' },
  { cropType: '玉米', stage: '抽穗期', minMoisture: 65, maxMoisture: 85, waterNeed: 1.4, description: '抽穗期需充足水分' },
  { cropType: '玉米', stage: '灌浆期', minMoisture: 55, maxMoisture: 75, waterNeed: 1.1, description: '灌浆期保持湿润' },
  { cropType: '玉米', stage: '成熟期', minMoisture: 45, maxMoisture: 60, waterNeed: 0.5, description: '成熟期控水' },
  
  // 大豆
  { cropType: '大豆', stage: '苗期', minMoisture: 50, maxMoisture: 70, waterNeed: 0.6, description: '苗期适度控水' },
  { cropType: '大豆', stage: '分蘖期', minMoisture: 55, maxMoisture: 75, waterNeed: 0.9, description: '分蘖期增加供水' },
  { cropType: '大豆', stage: '拔节期', minMoisture: 60, maxMoisture: 80, waterNeed: 1.1, description: '拔节期需水增加' },
  { cropType: '大豆', stage: '抽穗期', minMoisture: 65, maxMoisture: 80, waterNeed: 1.2, description: '开花结荚期需充足水分' },
  { cropType: '大豆', stage: '灌浆期', minMoisture: 55, maxMoisture: 75, waterNeed: 1.0, description: '鼓粒期保持湿润' },
  { cropType: '大豆', stage: '成熟期', minMoisture: 40, maxMoisture: 55, waterNeed: 0.4, description: '成熟期控水促熟' },
  
  // 棉花
  { cropType: '棉花', stage: '苗期', minMoisture: 45, maxMoisture: 65, waterNeed: 0.6, description: '苗期适度控水' },
  { cropType: '棉花', stage: '分蘖期', minMoisture: 50, maxMoisture: 70, waterNeed: 0.8, description: '现蕾期增加供水' },
  { cropType: '棉花', stage: '拔节期', minMoisture: 55, maxMoisture: 75, waterNeed: 1.0, description: '开花期需充足水分' },
  { cropType: '棉花', stage: '抽穗期', minMoisture: 60, maxMoisture: 80, waterNeed: 1.2, description: '花铃期需水量最大' },
  { cropType: '棉花', stage: '灌浆期', minMoisture: 50, maxMoisture: 70, waterNeed: 0.9, description: '吐絮期适度供水' },
  { cropType: '棉花', stage: '成熟期', minMoisture: 40, maxMoisture: 55, waterNeed: 0.4, description: '成熟期控水' },
  
  // 蔬菜
  { cropType: '蔬菜', stage: '苗期', minMoisture: 60, maxMoisture: 80, waterNeed: 0.8, description: '苗期保持湿润' },
  { cropType: '蔬菜', stage: '分蘖期', minMoisture: 65, maxMoisture: 85, waterNeed: 1.0, description: '生长期需充足水分' },
  { cropType: '蔬菜', stage: '拔节期', minMoisture: 70, maxMoisture: 85, waterNeed: 1.1, description: '营养生长期需水量大' },
  { cropType: '蔬菜', stage: '抽穗期', minMoisture: 65, maxMoisture: 80, waterNeed: 1.0, description: '开花期适度控水' },
  { cropType: '蔬菜', stage: '灌浆期', minMoisture: 60, maxMoisture: 80, waterNeed: 0.9, description: '结果期保持湿润' },
  { cropType: '蔬菜', stage: '成熟期', minMoisture: 50, maxMoisture: 70, waterNeed: 0.6, description: '采收期适度控水' },
];

// 土壤特性
export interface SoilCharacteristic {
  type: SoilType;
  waterRetention: '低' | '中' | '高';
  irrigationEfficiency: number; // 灌溉效率系数 0.7-1.0
  description: string;
}

export const SOIL_CHARACTERISTICS: SoilCharacteristic[] = [
  { type: '砂土', waterRetention: '低', irrigationEfficiency: 0.85, description: '砂土保水性差，灌溉效率85%，需少量多次' },
  { type: '壤土', waterRetention: '中', irrigationEfficiency: 0.95, description: '壤土保水性适中，灌溉效率95%' },
  { type: '粘土', waterRetention: '高', irrigationEfficiency: 0.75, description: '粘土保水性好但渗透慢，灌溉效率75%，需避免积水' },
];

// 灌溉量计算参数
export interface IrrigationParams {
  area: number; // 面积（亩）
  soilMoisture: number; // 当前土壤湿度%
  targetMoisture: number; // 目标土壤湿度%
  soilType: SoilType;
  waterNeed: number; // 作物需水系数
}

// 计算灌溉量（立方米/亩）
export function calculateIrrigationAmount(params: IrrigationParams): number {
  const soilChar = SOIL_CHARACTERISTICS.find(s => s.type === params.soilType);
  const efficiency = soilChar?.irrigationEfficiency ?? 0.9;
  
  // 基础公式：灌溉量 = (目标湿度 - 当前湿度) * 土壤系数 * 需水系数 / 灌溉效率
  const moistureDiff = params.targetMoisture - params.soilMoisture;
  if (moistureDiff <= 0) return 0;
  
  // 土壤容重系数（简化）
  const soilFactor = params.soilType === '砂土' ? 0.8 : params.soilType === '粘土' ? 1.2 : 1.0;
  
  // 计算每亩需水量（立方米）
  const amount = (moistureDiff * soilFactor * params.waterNeed) / (efficiency * 10);
  
  return Math.round(amount * 10) / 10; // 保留1位小数
}

// 获取作物生育期信息
export function getCropWaterNeed(cropType: CropType, stage: GrowthStage): CropWaterNeed | undefined {
  return CROP_WATER_NEEDS.find(n => n.cropType === cropType && n.stage === stage);
}

// 兼容旧代码的导出
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
  area: number;
  soilMoisture: number;
  moistureThreshold: number;
  lastIrrigationDate: string | null;
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

// 兼容旧代码的专家规则
export const EXPERT_RULES = [
  { cropType: '水稻' as CropType, minMoisture: 60, maxMoisture: 90, description: '水稻需保持较高湿度' },
  { cropType: '小麦' as CropType, minMoisture: 50, maxMoisture: 80, description: '小麦生长期需适度湿润' },
  { cropType: '玉米' as CropType, minMoisture: 55, maxMoisture: 85, description: '玉米需充足水分' },
  { cropType: '大豆' as CropType, minMoisture: 50, maxMoisture: 80, description: '大豆耐旱性较好' },
  { cropType: '棉花' as CropType, minMoisture: 45, maxMoisture: 75, description: '棉花需适度控水' },
  { cropType: '蔬菜' as CropType, minMoisture: 60, maxMoisture: 85, description: '蔬菜需保持湿润' },
];
