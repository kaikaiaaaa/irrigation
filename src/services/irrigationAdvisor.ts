import type { CropType, SoilType, GrowthStage } from '@/types/device';
import { getCropWaterNeed, getSoilPhysics, calculateIrrigationAmount, calculateAvailableWater, calculateCropWaterRequirement } from '@/types/device';

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
  shouldIrrigate: boolean;
  urgency: 'immediate' | 'soon' | 'later' | 'no';
  currentMoisture: number; // 当前湿度
  targetMoisture: number; // 目标湿度
  availableWater: number; // 有效水分%
  irrigationAmount: number; // 建议灌溉量（立方米/亩）
  totalAmount: number; // 总灌溉量（立方米）
  duration: number; // 预计灌溉时长（分钟）
  dailyWaterNeed: number; // 日需水量（mm）
  reason: string;
  tips: string[];
}

export function getIrrigationAdvice(input: IrrigationInput): IrrigationAdvice {
  const waterNeed = getCropWaterNeed(input.cropType, input.growthStage);
  const soilPhysics = getSoilPhysics(input.soilType);

  if (!waterNeed || !soilPhysics) {
    return {
      shouldIrrigate: false,
      urgency: 'no',
      currentMoisture: input.soilMoisture,
      targetMoisture: 60,
      availableWater: 0,
      irrigationAmount: 0,
      totalAmount: 0,
      duration: 0,
      dailyWaterNeed: 0,
      reason: '未找到该作物生育期的数据',
      tips: ['请检查作物类型和生育期设置'],
    };
  }

  // 计算目标湿度（田间持水量的百分比）
  const targetMoisture = Math.round(soilPhysics.fieldCapacity * (waterNeed.optimalWaterPercent / 100));
  const minMoisture = Math.round(soilPhysics.fieldCapacity * (waterNeed.minWaterPercent / 100));

  // 计算有效水分
  const availableWater = calculateAvailableWater(input.soilMoisture, input.soilType);

  // 计算日需水量
  const dailyWaterNeed = calculateCropWaterRequirement(input.temperature, input.humidity, waterNeed.cropCoefficient);

  // 判断是否需灌溉
  let shouldIrrigate = false;
  let urgency: IrrigationAdvice['urgency'] = 'no';

  if (input.soilMoisture < minMoisture) {
    shouldIrrigate = true;
    urgency = 'immediate';
  } else if (availableWater < 30) {
    shouldIrrigate = true;
    urgency = 'soon';
  } else if (input.soilMoisture < targetMoisture - 5) {
    shouldIrrigate = true;
    urgency = 'later';
  }

  // 计算灌溉量
  let irrigationAmount = 0;
  if (shouldIrrigate) {
    irrigationAmount = calculateIrrigationAmount(
      input.soilMoisture,
      targetMoisture,
      input.soilType,
      waterNeed.rootDepth
    );

    // 根据天气调整
    if (input.hasRainForecast) {
      irrigationAmount *= 0.5;
    }
    if (input.temperature > 35) {
      irrigationAmount *= 1.15;
    }
    if (input.humidity > 80) {
      irrigationAmount *= 0.9;
    }

    irrigationAmount = Math.round(irrigationAmount * 10) / 10;
  }

  const totalAmount = Math.round(irrigationAmount * input.area * 10) / 10;

  // 计算灌溉时长（基于入渗速率）
  const duration = irrigationAmount > 0
    ? Math.round((irrigationAmount / soilPhysics.infiltrationRate) * 60)
    : 0;

  // 生成建议原因
  let reason = '';
  if (!shouldIrrigate) {
    reason = `当前土壤湿度${input.soilMoisture}%适宜，有效水分${availableWater}%。${input.cropType}${input.growthStage}的适宜范围为田间持水量的${waterNeed.minWaterPercent}%-${waterNeed.maxWaterPercent}%`;
  } else if (urgency === 'immediate') {
    reason = `当前土壤湿度${input.soilMoisture}%低于最低要求${minMoisture}%（田间持水量的${waterNeed.minWaterPercent}%），有效水分仅${availableWater}%，需要立即灌溉`;
  } else if (urgency === 'soon') {
    reason = `当前有效水分${availableWater}%偏低，${input.cropType}${input.growthStage}需要保持田间持水量的${waterNeed.minWaterPercent}%以上`;
  } else {
    reason = `当前土壤湿度${input.soilMoisture}%，低于最适水平${targetMoisture}%，可考虑适当补水`;
  }

  // 生成灌溉建议
  const tips: string[] = [];

  if (shouldIrrigate) {
    tips.push(`作物日需水量约${dailyWaterNeed}mm，当前${input.cropType}处于${input.growthStage}，${waterNeed.description}`);

    if (input.hasRainForecast) {
      tips.push('未来24小时有降雨预报，已自动减少50%灌溉量，建议适当灌溉或等待降雨');
    }

    if (input.temperature > 35) {
      tips.push(`当前温度${input.temperature}°C较高，蒸发量大，建议在清晨（5-7时）或傍晚（17-19时）灌溉`);
    } else if (input.temperature < 10) {
      tips.push('当前温度较低，灌溉时注意避免根系受冻');
    }

    if (input.soilType === '砂土') {
      tips.push('砂土保水性差，建议少量多次灌溉，每次不超过20立方米/亩');
    } else if (input.soilType === '粘土') {
      tips.push(`粘土渗透较慢（入渗速率${soilPhysics.infiltrationRate}mm/h），建议控制灌溉速度，避免积水`);
    }

    if (waterNeed.cropCoefficient > 1.1) {
      tips.push(`${input.growthStage}是需水关键期（作物系数${waterNeed.cropCoefficient}），请确保灌溉充足`);
    }

    tips.push(`建议灌溉量：${irrigationAmount}立方米/亩`);
    if (input.area > 1) {
      tips.push(`总面积${input.area}亩，总需水量${totalAmount}立方米`);
    }
    if (duration > 0) {
      tips.push(`预计灌溉时长：约${duration}分钟（基于土壤入渗速率${soilPhysics.infiltrationRate}mm/h）`);
    }
  } else {
    tips.push(waterNeed.description);
    tips.push(`土壤类型：${soilPhysics.description}`);
    tips.push(`当前有效水分${availableWater}%，处于适宜范围`);

    if (availableWater > 80) {
      tips.push('土壤湿度较高，注意排水防涝');
    }

    // 预测未来需水
    if (dailyWaterNeed > 5) {
      const daysToIrrigate = Math.floor((availableWater - 30) / (dailyWaterNeed * 0.5));
      if (daysToIrrigate > 0 && daysToIrrigate < 7) {
        tips.push(`预计${daysToIrrigate}天后需要灌溉（基于当前蒸发量）`);
      }
    }
  }

  return {
    shouldIrrigate,
    urgency,
    currentMoisture: input.soilMoisture,
    targetMoisture,
    availableWater,
    irrigationAmount,
    totalAmount,
    duration,
    dailyWaterNeed,
    reason,
    tips,
  };
}

export function getUrgencyText(urgency: IrrigationAdvice['urgency']): string {
  const texts = {
    immediate: '立即灌溉',
    soon: '尽快灌溉',
    later: '适时灌溉',
    no: '无需灌溉',
  };
  return texts[urgency];
}

export function getUrgencyColor(urgency: IrrigationAdvice['urgency']): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  const colors = {
    immediate: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500' },
    soon: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-500' },
    later: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-500' },
    no: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-500' },
  };
  return colors[urgency];
}
