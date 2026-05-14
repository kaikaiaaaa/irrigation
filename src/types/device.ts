export type CropType = '水稻' | '小麦' | '玉米' | '大豆' | '棉花' | '蔬菜';

export type SoilType = '砂土' | '壤土' | '粘土';

export type GrowthStage = '苗期' | '分蘖期' | '拔节期' | '抽穗期' | '灌浆期' | '成熟期';

export const CROP_TYPES: CropType[] = ['水稻', '小麦', '玉米', '大豆', '棉花', '蔬菜'];

export const SOIL_TYPES: SoilType[] = ['砂土', '壤土', '粘土'];

export const GROWTH_STAGES: GrowthStage[] = ['苗期', '分蘖期', '拔节期', '抽穗期', '灌浆期', '成熟期'];

// 土壤物理参数（更科学的参数）
export interface SoilPhysics {
  type: SoilType;
  fieldCapacity: number; // 田间持水量 %
  wiltingPoint: number; // 萎蔫系数 %
  bulkDensity: number; // 容重 g/cm³
  infiltrationRate: number; // 入渗速率 mm/h
  description: string;
}

// 土壤物理特性（基于农业科学数据）
export const SOIL_PHYSICS: SoilPhysics[] = [
  {
    type: '砂土',
    fieldCapacity: 22,
    wiltingPoint: 8,
    bulkDensity: 1.65,
    infiltrationRate: 25,
    description: '砂土透气性好但保水性差，需少量多次灌溉',
  },
  {
    type: '壤土',
    fieldCapacity: 32,
    wiltingPoint: 12,
    bulkDensity: 1.40,
    infiltrationRate: 15,
    description: '壤土保水透气均衡，是最理想的耕作土壤',
  },
  {
    type: '粘土',
    fieldCapacity: 45,
    wiltingPoint: 20,
    bulkDensity: 1.25,
    infiltrationRate: 5,
    description: '粘土保水性强但透气性差，需注意排水防涝',
  },
];

// 作物各生育期的需水参数
export interface CropWaterNeed {
  cropType: CropType;
  stage: GrowthStage;
  // 土壤水分适宜范围（占田间持水量的百分比）
  minWaterPercent: number; // 最低适宜水分（如60%表示田间持水量的60%）
  optimalWaterPercent: number; // 最适宜水分
  maxWaterPercent: number; // 最高适宜水分
  // 作物系数（用于计算蒸散发）
  cropCoefficient: number; // Kc 值 0.3-1.2
  // 根系深度（米）
  rootDepth: number;
  description: string;
}

// 作物系数参考 FAO-56 标准
export const CROP_WATER_NEEDS: CropWaterNeed[] = [
  // 水稻
  { cropType: '水稻', stage: '苗期', minWaterPercent: 80, optimalWaterPercent: 90, maxWaterPercent: 100, cropCoefficient: 1.05, rootDepth: 0.2, description: '苗期保持浅水层，田间持水量80%以上' },
  { cropType: '水稻', stage: '分蘖期', minWaterPercent: 85, optimalWaterPercent: 95, maxWaterPercent: 100, cropCoefficient: 1.20, rootDepth: 0.3, description: '分蘖期需水量大，保持淹水状态' },
  { cropType: '水稻', stage: '拔节期', minWaterPercent: 80, optimalWaterPercent: 90, maxWaterPercent: 100, cropCoefficient: 1.35, rootDepth: 0.4, description: '拔节期需充足水分' },
  { cropType: '水稻', stage: '抽穗期', minWaterPercent: 85, optimalWaterPercent: 95, maxWaterPercent: 100, cropCoefficient: 1.30, rootDepth: 0.5, description: '抽穗期是需水关键期，不可缺水' },
  { cropType: '水稻', stage: '灌浆期', minWaterPercent: 75, optimalWaterPercent: 85, maxWaterPercent: 95, cropCoefficient: 1.15, rootDepth: 0.5, description: '灌浆期保持湿润，逐渐落干' },
  { cropType: '水稻', stage: '成熟期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 0.90, rootDepth: 0.5, description: '成熟期适当控水，利于收获' },

  // 小麦
  { cropType: '小麦', stage: '苗期', minWaterPercent: 55, optimalWaterPercent: 65, maxWaterPercent: 75, cropCoefficient: 0.70, rootDepth: 0.3, description: '苗期适度控水，促进根系下扎' },
  { cropType: '小麦', stage: '分蘖期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 0.90, rootDepth: 0.5, description: '分蘖期需水增加' },
  { cropType: '小麦', stage: '拔节期', minWaterPercent: 65, optimalWaterPercent: 75, maxWaterPercent: 85, cropCoefficient: 1.05, rootDepth: 0.8, description: '拔节期需水增加' },
  { cropType: '小麦', stage: '抽穗期', minWaterPercent: 70, optimalWaterPercent: 80, maxWaterPercent: 85, cropCoefficient: 1.15, rootDepth: 1.0, description: '抽穗开花期是需水关键期' },
  { cropType: '小麦', stage: '灌浆期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 0.95, rootDepth: 1.0, description: '灌浆期保持土壤湿润' },
  { cropType: '小麦', stage: '成熟期', minWaterPercent: 45, optimalWaterPercent: 55, maxWaterPercent: 65, cropCoefficient: 0.75, rootDepth: 1.0, description: '成熟期控水促熟' },

  // 玉米
  { cropType: '玉米', stage: '苗期', minWaterPercent: 50, optimalWaterPercent: 60, maxWaterPercent: 70, cropCoefficient: 0.65, rootDepth: 0.3, description: '苗期适度控水，蹲苗防徒长' },
  { cropType: '玉米', stage: '分蘖期', minWaterPercent: 55, optimalWaterPercent: 65, maxWaterPercent: 75, cropCoefficient: 0.85, rootDepth: 0.5, description: '拔节期需水增加' },
  { cropType: '玉米', stage: '拔节期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 1.05, rootDepth: 0.7, description: '大喇叭口期需水量大' },
  { cropType: '玉米', stage: '抽穗期', minWaterPercent: 65, optimalWaterPercent: 75, maxWaterPercent: 85, cropCoefficient: 1.20, rootDepth: 0.8, description: '抽雄吐丝期是需水关键期' },
  { cropType: '玉米', stage: '灌浆期', minWaterPercent: 55, optimalWaterPercent: 65, maxWaterPercent: 75, cropCoefficient: 1.05, rootDepth: 0.8, description: '灌浆期保持湿润' },
  { cropType: '玉米', stage: '成熟期', minWaterPercent: 45, optimalWaterPercent: 50, maxWaterPercent: 60, cropCoefficient: 0.80, rootDepth: 0.8, description: '成熟期适当控水' },

  // 大豆
  { cropType: '大豆', stage: '苗期', minWaterPercent: 50, optimalWaterPercent: 60, maxWaterPercent: 70, cropCoefficient: 0.60, rootDepth: 0.3, description: '苗期适度控水' },
  { cropType: '大豆', stage: '分蘖期', minWaterPercent: 55, optimalWaterPercent: 65, maxWaterPercent: 75, cropCoefficient: 0.85, rootDepth: 0.4, description: '分枝期需水增加' },
  { cropType: '大豆', stage: '拔节期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 1.00, rootDepth: 0.5, description: '开花期需充足水分' },
  { cropType: '大豆', stage: '抽穗期', minWaterPercent: 65, optimalWaterPercent: 75, maxWaterPercent: 80, cropCoefficient: 1.10, rootDepth: 0.6, description: '结荚鼓粒期是需水关键期' },
  { cropType: '大豆', stage: '灌浆期', minWaterPercent: 55, optimalWaterPercent: 65, maxWaterPercent: 75, cropCoefficient: 0.95, rootDepth: 0.6, description: '鼓粒期保持湿润' },
  { cropType: '大豆', stage: '成熟期', minWaterPercent: 40, optimalWaterPercent: 45, maxWaterPercent: 55, cropCoefficient: 0.70, rootDepth: 0.6, description: '成熟期控水促熟' },

  // 棉花
  { cropType: '棉花', stage: '苗期', minWaterPercent: 45, optimalWaterPercent: 55, maxWaterPercent: 65, cropCoefficient: 0.65, rootDepth: 0.3, description: '苗期适度控水，促进根系发育' },
  { cropType: '棉花', stage: '分蘖期', minWaterPercent: 50, optimalWaterPercent: 60, maxWaterPercent: 70, cropCoefficient: 0.80, rootDepth: 0.5, description: '现蕾期需水增加' },
  { cropType: '棉花', stage: '拔节期', minWaterPercent: 55, optimalWaterPercent: 65, maxWaterPercent: 75, cropCoefficient: 0.95, rootDepth: 0.7, description: '开花期需充足水分' },
  { cropType: '棉花', stage: '抽穗期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 1.10, rootDepth: 0.8, description: '花铃期是需水关键期' },
  { cropType: '棉花', stage: '灌浆期', minWaterPercent: 50, optimalWaterPercent: 60, maxWaterPercent: 70, cropCoefficient: 0.90, rootDepth: 0.8, description: '吐絮期适度供水' },
  { cropType: '棉花', stage: '成熟期', minWaterPercent: 40, optimalWaterPercent: 45, maxWaterPercent: 55, cropCoefficient: 0.70, rootDepth: 0.8, description: '成熟期控水' },

  // 蔬菜
  { cropType: '蔬菜', stage: '苗期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 0.80, rootDepth: 0.15, description: '苗期保持湿润' },
  { cropType: '蔬菜', stage: '分蘖期', minWaterPercent: 65, optimalWaterPercent: 75, maxWaterPercent: 85, cropCoefficient: 0.95, rootDepth: 0.25, description: '生长期需充足水分' },
  { cropType: '蔬菜', stage: '拔节期', minWaterPercent: 70, optimalWaterPercent: 80, maxWaterPercent: 85, cropCoefficient: 1.05, rootDepth: 0.3, description: '营养生长期需水量大' },
  { cropType: '蔬菜', stage: '抽穗期', minWaterPercent: 65, optimalWaterPercent: 75, maxWaterPercent: 80, cropCoefficient: 0.95, rootDepth: 0.3, description: '开花期适度控水' },
  { cropType: '蔬菜', stage: '灌浆期', minWaterPercent: 60, optimalWaterPercent: 70, maxWaterPercent: 80, cropCoefficient: 0.90, rootDepth: 0.3, description: '结果期保持湿润' },
  { cropType: '蔬菜', stage: '成熟期', minWaterPercent: 50, optimalWaterPercent: 55, maxWaterPercent: 65, cropCoefficient: 0.75, rootDepth: 0.3, description: '采收前适度控水' },
];

// 获取土壤物理特性
export function getSoilPhysics(soilType: SoilType): SoilPhysics | undefined {
  return SOIL_PHYSICS.find(s => s.type === soilType);
}

// 获取作物生育期信息
export function getCropWaterNeed(cropType: CropType, stage: GrowthStage): CropWaterNeed | undefined {
  return CROP_WATER_NEEDS.find(n => n.cropType === cropType && n.stage === stage);
}

// 计算土壤有效水分（%）
// 有效水分 = (当前含水量 - 萎蔫系数) / (田间持水量 - 萎蔫系数) × 100%
export function calculateAvailableWater(soilMoisture: number, soilType: SoilType): number {
  const physics = getSoilPhysics(soilType);
  if (!physics) return 0;

  const { fieldCapacity, wiltingPoint } = physics;

  if (soilMoisture <= wiltingPoint) return 0;
  if (soilMoisture >= fieldCapacity) return 100;

  return Math.round(((soilMoisture - wiltingPoint) / (fieldCapacity - wiltingPoint)) * 100);
}

// 计算灌溉量（立方米/亩）
// 使用更科学的公式：
// 灌溉量 = 面积 × 根系深度 × 容重 × (目标含水量 - 当前含水量) / 100
export function calculateIrrigationAmount(
  soilMoisture: number,
  targetMoisture: number,
  soilType: SoilType,
  rootDepth: number
): number {
  if (targetMoisture <= soilMoisture) return 0;

  const physics = getSoilPhysics(soilType);
  if (!physics) return 0;

  // 亩换算为平方米：1亩 = 666.67平方米
  const area_m2 = 666.67;

  // 计算土壤体积（立方米）
  const soilVolume = area_m2 * rootDepth;

  // 计算水分差（体积含水量差）
  // 体积含水量 = 质量含水量 × 容重
  const currentVolumetricWater = (soilMoisture / 100) * physics.bulkDensity;
  const targetVolumetricWater = (targetMoisture / 100) * physics.bulkDensity;
  const waterDiff = targetVolumetricWater - currentVolumetricWater;

  if (waterDiff <= 0) return 0;

  // 计算需水量（立方米）
  const amount = soilVolume * waterDiff;

  // 考虑灌溉效率（入渗率影响）
  const efficiency = Math.min(1.0, physics.infiltrationRate / 15);
  const adjustedAmount = amount / efficiency;

  return Math.round(adjustedAmount * 10) / 10;
}

// 计算参考蒸散发量（简化 Penman-Monteith）
export function calculateET0(temperature: number, humidity: number): number {
  // 简化公式：ET0 ≈ 0.0023 × (Tmean + 17.8) × (Tmax - Tmin)^0.5 × Ra
  // 这里使用简化版本
  const et0 = 0.0023 * (temperature + 17.8) * Math.sqrt(Math.max(0, temperature - 10)) * 2.5;

  // 湿度修正
  const humidityFactor = 1 - (humidity - 50) / 200;

  return Math.round(et0 * humidityFactor * 10) / 10;
}

// 计算作物需水量（mm/天）
export function calculateCropWaterRequirement(
  temperature: number,
  humidity: number,
  cropCoefficient: number
): number {
  const et0 = calculateET0(temperature, humidity);
  return Math.round(et0 * cropCoefficient * 10) / 10;
}
