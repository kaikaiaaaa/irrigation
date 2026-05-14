import type { CropType, SoilType, GrowthStage } from '@/types/device';
import { getCropWaterNeed, calculateIrrigationAmount, SOIL_CHARACTERISTICS } from '@/types/device';

export interface IrrigationInput {
  cropType: CropType;
  growthStage: GrowthStage;
  soilType: SoilType;
  soilMoisture: number; // 当前土壤湿度%
  area: number; // 面积（亩）
  temperature: number; // 当前温度°C
  humidity: number; // 当前湿度%
  hasRainForecast: boolean; // 未来24小时是否有雨
}

export interface IrrigationAdvice {
  shouldIrrigate: boolean; // 是否应该灌溉
  urgency: 'immediate' | 'soon' | 'later' | 'no'; // 紧急程度
  currentMoisture: number; // 当前湿度
  targetMoisture: number; // 目标湿度
  moistureDiff: number; // 湿度差
  irrigationAmount: number; // 建议灌溉量（立方米/亩）
  totalAmount: number; // 总灌溉量（立方米）
  duration: number; // 预计灌溉时长（小时）
  reason: string; // 建议原因
  tips: string[]; // 灌溉建议
}

// 根据天气调整灌溉量
function adjustForWeather(baseAmount: number, temp: number, humidity: number, hasRain: boolean): number {
  let adjusted = baseAmount;
  
  // 高温增加灌溉量
  if (temp > 30) {
    adjusted *= 1.2;
  } else if (temp < 15) {
    adjusted *= 0.8;
  }
  
  // 高湿度减少灌溉量
  if (humidity > 80) {
    adjusted *= 0.9;
  } else if (humidity < 40) {
    adjusted *= 1.1;
  }
  
  // 有降雨预报减少灌溉量
  if (hasRain) {
    adjusted *= 0.5;
  }
  
  return Math.round(adjusted * 10) / 10;
}

// 计算预计灌溉时长（简化计算：假设流量为每小时15立方米/亩）
function calculateDuration(amount: number): number {
  const flowRate = 15; // 立方米/小时/亩
  return Math.round((amount / flowRate) * 60); // 转换为分钟
}

export function getIrrigationAdvice(input: IrrigationInput): IrrigationAdvice {
  const waterNeed = getCropWaterNeed(input.cropType, input.growthStage);
  const soilChar = SOIL_CHARACTERISTICS.find(s => s.type === input.soilType);
  
  if (!waterNeed) {
    return {
      shouldIrrigate: false,
      urgency: 'no',
      currentMoisture: input.soilMoisture,
      targetMoisture: 60,
      moistureDiff: 0,
      irrigationAmount: 0,
      totalAmount: 0,
      duration: 0,
      reason: '未找到该作物生育期的数据',
      tips: ['请检查作物类型和生育期设置'],
    };
  }
  
  const targetMoisture = waterNeed.maxMoisture;
  const moistureDiff = targetMoisture - input.soilMoisture;
  
  // 判断是否需灌溉
  let shouldIrrigate = false;
  let urgency: IrrigationAdvice['urgency'] = 'no';
  
  if (input.soilMoisture < waterNeed.minMoisture) {
    shouldIrrigate = true;
    urgency = 'immediate';
  } else if (input.soilMoisture < waterNeed.minMoisture + 10) {
    shouldIrrigate = true;
    urgency = 'soon';
  } else if (moistureDiff > 15) {
    shouldIrrigate = true;
    urgency = 'later';
  }
  
  // 计算基础灌溉量
  let irrigationAmount = 0;
  if (shouldIrrigate) {
    irrigationAmount = calculateIrrigationAmount({
      area: input.area,
      soilMoisture: input.soilMoisture,
      targetMoisture: targetMoisture,
      soilType: input.soilType,
      waterNeed: waterNeed.waterNeed,
    });
    
    // 根据天气调整
    irrigationAmount = adjustForWeather(irrigationAmount, input.temperature, input.humidity, input.hasRainForecast);
  }
  
  const totalAmount = Math.round(irrigationAmount * input.area * 10) / 10;
  const duration = calculateDuration(irrigationAmount);
  
  // 生成建议原因
  let reason = '';
  if (!shouldIrrigate) {
    reason = `当前土壤湿度${input.soilMoisture}%适宜，${input.cropType}${input.growthStage}的适宜范围为${waterNeed.minMoisture}%-${waterNeed.maxMoisture}%`;
  } else if (urgency === 'immediate') {
    reason = `当前土壤湿度${input.soilMoisture}%低于${input.cropType}${input.growthStage}的最低要求${waterNeed.minMoisture}%，需要立即灌溉`;
  } else if (urgency === 'soon') {
    reason = `当前土壤湿度${input.soilMoisture}%接近${input.cropType}${input.growthStage}的最低要求${waterNeed.minMoisture}%，建议尽快灌溉`;
  } else {
    reason = `当前土壤湿度${input.soilMoisture}%，可考虑适当补水以达到最佳生长状态`;
  }
  
  // 生成灌溉建议
  const tips: string[] = [];
  
  if (shouldIrrigate) {
    if (input.hasRainForecast) {
      tips.push('未来24小时有降雨预报，建议适当减少灌溉量或等待降雨');
    }
    
    if (input.temperature > 35) {
      tips.push('当前温度较高，建议在清晨或傍晚灌溉，避免中午高温时段');
    }
    
    if (input.soilType === '砂土') {
      tips.push('砂土保水性差，建议少量多次灌溉');
    } else if (input.soilType === '粘土') {
      tips.push('粘土渗透慢，建议控制灌溉速度，避免积水');
    }
    
    if (input.growthStage === '抽穗期' || input.growthStage === '灌浆期') {
      tips.push(`${input.growthStage}是需水关键期，请确保灌溉充足`);
    }
    
    tips.push(`建议灌溉量：${irrigationAmount}立方米/亩，总计${totalAmount}立方米`);
    tips.push(`预计灌溉时长：约${duration}分钟`);
  } else {
    tips.push(waterNeed.description);
    tips.push(`土壤类型：${soilChar?.description || ''}`);
    
    if (moistureDiff < 10) {
      tips.push('土壤湿度接近上限，注意避免过湿');
    }
  }
  
  return {
    shouldIrrigate,
    urgency,
    currentMoisture: input.soilMoisture,
    targetMoisture,
    moistureDiff,
    irrigationAmount,
    totalAmount,
    duration,
    reason,
    tips,
  };
}

// 获取紧急程度文本
export function getUrgencyText(urgency: IrrigationAdvice['urgency']): string {
  const texts = {
    immediate: '立即灌溉',
    soon: '尽快灌溉',
    later: '适时灌溉',
    no: '无需灌溉',
  };
  return texts[urgency];
}

// 获取紧急程度颜色
export function getUrgencyColor(urgency: IrrigationAdvice['urgency']): string {
  const colors = {
    immediate: 'text-red-600 bg-red-50 border-red-200',
    soon: 'text-orange-600 bg-orange-50 border-orange-200',
    later: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    no: 'text-green-600 bg-green-50 border-green-200',
  };
  return colors[urgency];
}
