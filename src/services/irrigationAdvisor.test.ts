import { describe, it, expect } from 'vitest';
import { calculateIrrigationAmount, getCropWaterNeed } from '@/types/device';
import { getIrrigationAdvice, getUrgencyText, getUrgencyColor } from '@/services/irrigationAdvisor';
import type { IrrigationInput } from '@/services/irrigationAdvisor';

describe('灌溉计算', () => {
  it('应计算正确的灌溉量', () => {
    const amount = calculateIrrigationAmount(40, 70, '壤土', 0.5);
    
    expect(amount).toBeGreaterThan(0);
    expect(amount).toBeLessThan(200);
  });

  it('湿度足够时应返回0', () => {
    const amount = calculateIrrigationAmount(80, 70, '壤土', 0.5);
    
    expect(amount).toBe(0);
  });

  it('应获取作物生育期信息', () => {
    const need = getCropWaterNeed('水稻', '抽穗期');
    
    expect(need).toBeDefined();
    expect(need?.cropType).toBe('水稻');
    expect(need?.stage).toBe('抽穗期');
    expect(need?.cropCoefficient).toBeGreaterThan(1.0);
  });

  it('应生成立即灌溉建议', () => {
    const input: IrrigationInput = {
      cropType: '水稻',
      growthStage: '抽穗期',
      soilType: '壤土',
      soilMoisture: 20,
      area: 5,
      temperature: 30,
      humidity: 60,
      hasRainForecast: false,
    };
    
    const advice = getIrrigationAdvice(input);
    
    expect(advice.shouldIrrigate).toBe(true);
    expect(advice.urgency).toBe('immediate');
    expect(advice.irrigationAmount).toBeGreaterThan(0);
    expect(advice.totalAmount).toBeGreaterThan(0);
  });

  it('应生成无需灌溉建议', () => {
    const input: IrrigationInput = {
      cropType: '水稻',
      growthStage: '抽穗期',
      soilType: '壤土',
      soilMoisture: 95,
      area: 5,
      temperature: 25,
      humidity: 60,
      hasRainForecast: false,
    };
    
    const advice = getIrrigationAdvice(input);
    
    expect(advice.shouldIrrigate).toBe(false);
    expect(advice.urgency).toBe('no');
    expect(advice.irrigationAmount).toBe(0);
  });

  it('降雨预报应减少灌溉量', () => {
    const input1: IrrigationInput = {
      cropType: '水稻',
      growthStage: '分蘖期',
      soilType: '壤土',
      soilMoisture: 20,
      area: 1,
      temperature: 25,
      humidity: 60,
      hasRainForecast: false,
    };
    
    const input2 = { ...input1, hasRainForecast: true };
    
    const advice1 = getIrrigationAdvice(input1);
    const advice2 = getIrrigationAdvice(input2);
    
    expect(advice2.irrigationAmount).toBeLessThan(advice1.irrigationAmount);
  });

  it('应返回正确的紧急程度文本', () => {
    expect(getUrgencyText('immediate')).toBe('立即灌溉');
    expect(getUrgencyText('no')).toBe('无需灌溉');
  });

  it('应返回正确的紧急程度颜色', () => {
    const color = getUrgencyColor('immediate');
    expect(color.bg).toContain('red');
    expect(color.text).toContain('red');
  });
});