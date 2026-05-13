import type { Device } from '@/types/device';
import { EXPERT_RULES, SOIL_CHARACTERISTICS } from '@/types/device';
import type { WeatherData, WeatherForecast } from '@/types/weather';
import type {
  RecommendationResult,
  RecommendationType,
  RecommendationReason,
} from '@/types/irrigation';
import { RECOMMENDATION_CONFIG } from '@/types/irrigation';

export function calculateRecommendation(
  device: Device,
  weather: WeatherData | null,
  forecast: WeatherForecast | null
): RecommendationResult {
  const reasons: RecommendationReason[] = [];

  // 1. 天气维度评分 (0-100)
  const weatherScore = calculateWeatherScore(weather, forecast, reasons);

  // 2. 土壤维度评分 (0-100)
  const soilScore = calculateSoilScore(device, reasons);

  // 3. 专家维度评分 (0-100)
  const expertScore = calculateExpertScore(device, reasons);

  // 计算加权总分
  const { weights } = RECOMMENDATION_CONFIG;
  const totalScore = Math.round(
    weatherScore * weights.weather +
    soilScore * weights.soil +
    expertScore * weights.expert
  );

  // 确定推荐类型
  const type = getRecommendationType(totalScore);

  // 生成总结
  const summary = generateSummary(type, reasons);

  return {
    type,
    score: totalScore,
    dimensions: {
      weather: weatherScore,
      soil: soilScore,
      expert: expertScore,
    },
    reasons,
    summary,
    timestamp: new Date().toISOString(),
  };
}

function calculateWeatherScore(
  weather: WeatherData | null,
  forecast: WeatherForecast | null,
  reasons: RecommendationReason[]
): number {
  let score = 50; // 基础分

  if (!weather) {
    reasons.push({
      dimension: 'weather',
      text: '暂无天气数据，使用默认值',
      impact: 'neutral',
    });
    return score;
  }

  // 当前降雨
  if (weather.precipitation > 0) {
    score -= 30;
    reasons.push({
      dimension: 'weather',
      text: `当前正在降雨 (${weather.precipitation}mm)`,
      impact: 'negative',
      value: `${weather.precipitation}mm`,
    });
  }

  // 未来24小时降雨预报
  if (forecast) {
    const maxRainProb = Math.max(...forecast.hourly.precipitationProbability);
    const avgRainProb = Math.round(
      forecast.hourly.precipitationProbability.reduce((a, b) => a + b, 0) /
        forecast.hourly.precipitationProbability.length
    );

    if (maxRainProb > 70) {
      score -= 25;
      reasons.push({
        dimension: 'weather',
        text: `未来24小时高降雨概率 (${maxRainProb}%)`,
        impact: 'negative',
        value: `${maxRainProb}%`,
      });
    } else if (avgRainProb > 30) {
      score -= 15;
      reasons.push({
        dimension: 'weather',
        text: `未来24小时中等降雨概率 (${avgRainProb}%)`,
        impact: 'negative',
        value: `${avgRainProb}%`,
      });
    } else {
      reasons.push({
        dimension: 'weather',
        text: '未来24小时降雨概率较低',
        impact: 'neutral',
      });
    }
  }

  // 温度影响
  if (weather.temperature > 30) {
    score += 15;
    reasons.push({
      dimension: 'weather',
      text: `高温加速蒸发 (${weather.temperature}°C)`,
      impact: 'positive',
      value: `${weather.temperature}°C`,
    });
  } else if (weather.temperature < 10) {
    score -= 10;
    reasons.push({
      dimension: 'weather',
      text: `低温减少蒸发 (${weather.temperature}°C)`,
      impact: 'negative',
      value: `${weather.temperature}°C`,
    });
  }

  // 湿度影响
  if (weather.humidity < 40) {
    score += 10;
    reasons.push({
      dimension: 'weather',
      text: `空气干燥，蒸发快 (${weather.humidity}%)`,
      impact: 'positive',
      value: `${weather.humidity}%`,
    });
  } else if (weather.humidity > 80) {
    score -= 10;
    reasons.push({
      dimension: 'weather',
      text: `空气湿度高，蒸发慢 (${weather.humidity}%)`,
      impact: 'negative',
      value: `${weather.humidity}%`,
    });
  }

  return Math.max(0, Math.min(100, score));
}

function calculateSoilScore(device: Device, reasons: RecommendationReason[]): number {
  let score = 50;
  const { soilMoisture, moistureThreshold, soilType } = device;

  // 土壤湿度与阈值比较
  const moistureDiff = soilMoisture - moistureThreshold;

  if (soilMoisture < moistureThreshold) {
    // 低于阈值，需要灌溉
    const severity = Math.abs(moistureDiff) / moistureThreshold;
    score += Math.round(severity * 40);
    reasons.push({
      dimension: 'soil',
      text: `土壤湿度 ${soilMoisture}% 低于阈值 ${moistureThreshold}%`,
      impact: 'positive',
      value: `${soilMoisture}% < ${moistureThreshold}%`,
    });
  } else if (soilMoisture > moistureThreshold + 20) {
    // 远高于阈值
    score -= 20;
    reasons.push({
      dimension: 'soil',
      text: `土壤湿度充足 ${soilMoisture}%`,
      impact: 'negative',
      value: `${soilMoisture}%`,
    });
  } else {
    // 接近阈值
    reasons.push({
      dimension: 'soil',
      text: `土壤湿度接近阈值 (${soilMoisture}%)`,
      impact: 'neutral',
      value: `${soilMoisture}%`,
    });
  }

  // 土壤类型调整
  const soilChar = SOIL_CHARACTERISTICS.find(s => s.type === soilType);
  if (soilChar) {
    if (soilChar.waterRetention === '低') {
      score += 10;
      reasons.push({
        dimension: 'soil',
        text: `${soilType}保水性差，需更频繁灌溉`,
        impact: 'positive',
      });
    } else if (soilChar.waterRetention === '高') {
      score -= 10;
      reasons.push({
        dimension: 'soil',
        text: `${soilType}保水性好`,
        impact: 'negative',
      });
    }
  }

  return Math.max(0, Math.min(100, score));
}

function calculateExpertScore(device: Device, reasons: RecommendationReason[]): number {
  let score = 50;
  const { cropType, lastIrrigationDate } = device;

  // 作物类型规则
  const expertRule = EXPERT_RULES.find(r => r.cropType === cropType);
  if (expertRule) {
    if (device.soilMoisture < expertRule.minMoisture) {
      score += 20;
      reasons.push({
        dimension: 'expert',
        text: `${cropType}的适宜湿度为 ${expertRule.minMoisture}-${expertRule.maxMoisture}%`,
        impact: 'positive',
      });
    }

    reasons.push({
      dimension: 'expert',
      text: expertRule.description,
      impact: 'neutral',
    });
  }

  // 上次灌溉时间
  if (lastIrrigationDate) {
    const daysSinceIrrigation = Math.floor(
      (Date.now() - new Date(lastIrrigationDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceIrrigation > 7) {
      score += 15;
      reasons.push({
        dimension: 'expert',
        text: `已 ${daysSinceIrrigation} 天未灌溉`,
        impact: 'positive',
        value: `${daysSinceIrrigation}天`,
      });
    } else if (daysSinceIrrigation < 2) {
      score -= 15;
      reasons.push({
        dimension: 'expert',
        text: `刚灌溉过 (${daysSinceIrrigation}天前)`,
        impact: 'negative',
        value: `${daysSinceIrrigation}天`,
      });
    }
  } else {
    // 从未灌溉
    score += 10;
    reasons.push({
      dimension: 'expert',
      text: '尚未记录灌溉',
      impact: 'positive',
    });
  }

  return Math.max(0, Math.min(100, score));
}

function getRecommendationType(score: number): RecommendationType {
  const { thresholds } = RECOMMENDATION_CONFIG;
  
  if (score <= thresholds.SKIP) return 'SKIP';
  if (score <= thresholds.DELAY) return 'DELAY';
  if (score <= thresholds.MONITOR) return 'MONITOR';
  return 'WATER';
}

function generateSummary(type: RecommendationType, reasons: RecommendationReason[]): string {
  const keyReasons = reasons
    .filter(r => r.impact === 'positive')
    .slice(0, 2)
    .map(r => r.text);

  switch (type) {
    case 'WATER':
      return `建议灌溉。${keyReasons.join('；')}。`;
    case 'DELAY':
      return '建议延迟灌溉，等待更合适的时机。';
    case 'SKIP':
      return '当前条件适宜，无需灌溉。';
    case 'MONITOR':
      return '建议继续监控土壤湿度和天气变化。';
    default:
      return '请根据实际情况判断。';
  }
}
