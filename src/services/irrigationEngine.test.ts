import { describe, it, expect } from 'vitest';
import { calculateRecommendation } from '@/services/irrigationEngine';
import type { Device } from '@/types/device';
import type { WeatherData, WeatherForecast } from '@/types/weather';

// 测试用的设备数据
const createTestDevice = (overrides: Partial<Device> = {}): Device => ({
  id: 'test-1',
  name: '测试地块',
  location: { latitude: 31.2304, longitude: 121.4737 },
  cropType: '水稻',
  soilType: '壤土',
  area: 5,
  soilMoisture: 50,
  moistureThreshold: 60,
  lastIrrigationDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// 测试用的天气数据
const createTestWeather = (overrides: Partial<WeatherData> = {}): WeatherData => ({
  temperature: 25,
  humidity: 60,
  precipitation: 0,
  windSpeed: 3,
  weatherCode: 0,
  timestamp: new Date().toISOString(),
  ...overrides,
});

// 测试用的预报数据
const createTestForecast = (): WeatherForecast => ({
  hourly: {
    time: Array.from({ length: 24 }, (_, i) => {
      const d = new Date();
      d.setHours(d.getHours() + i);
      return d.toISOString();
    }),
    temperature2m: Array(24).fill(25),
    humidity2m: Array(24).fill(60),
    precipitation: Array(24).fill(0),
    precipitationProbability: Array(24).fill(10),
    weatherCode: Array(24).fill(0),
  },
  daily: {
    time: [new Date().toISOString()],
    temperatureMax: [30],
    temperatureMin: [20],
    precipitationSum: [0],
  },
});

describe('灌溉建议引擎', () => {
  it('土壤湿度低于阈值时应建议灌溉', () => {
    const device = createTestDevice({ soilMoisture: 30, moistureThreshold: 60 });
    const weather = createTestWeather();
    const forecast = createTestForecast();

    const result = calculateRecommendation(device, weather, forecast);

    expect(result.score).toBeGreaterThan(50);
    expect(['WATER', 'MONITOR']).toContain(result.type);
  });

  it('土壤湿度充足时应无需灌溉', () => {
    const device = createTestDevice({ soilMoisture: 90, moistureThreshold: 60 });
    const weather = createTestWeather();
    const forecast = createTestForecast();

    const result = calculateRecommendation(device, weather, forecast);

    expect(result.score).toBeLessThanOrEqual(60);
    expect(['SKIP', 'DELAY', 'MONITOR']).toContain(result.type);
  });

  it('降雨时应降低灌溉建议', () => {
    const device = createTestDevice({ soilMoisture: 45, moistureThreshold: 60 });
    const weather = createTestWeather({ precipitation: 5 });
    const forecast = createTestForecast();

    const result1 = calculateRecommendation(device, weather, forecast);
    
    const weatherNoRain = createTestWeather({ precipitation: 0 });
    const result2 = calculateRecommendation(device, weatherNoRain, forecast);

    expect(result1.score).toBeLessThan(result2.score);
  });

  it('高温时应增加灌溉建议', () => {
    const device = createTestDevice({ soilMoisture: 50, moistureThreshold: 60 });
    const coolWeather = createTestWeather({ temperature: 20 });
    const hotWeather = createTestWeather({ temperature: 35 });
    const forecast = createTestForecast();

    const result1 = calculateRecommendation(device, coolWeather, forecast);
    const result2 = calculateRecommendation(device, hotWeather, forecast);

    expect(result2.score).toBeGreaterThan(result1.score);
  });

  it('高降雨概率时应降低灌溉建议', () => {
    const device = createTestDevice({ soilMoisture: 45, moistureThreshold: 60 });
    const weather = createTestWeather();
    
    const lowRainForecast = createTestForecast();
    lowRainForecast.hourly.precipitationProbability = Array(24).fill(10);
    
    const highRainForecast = createTestForecast();
    highRainForecast.hourly.precipitationProbability = Array(24).fill(80);

    const result1 = calculateRecommendation(device, weather, lowRainForecast);
    const result2 = calculateRecommendation(device, weather, highRainForecast);

    expect(result2.score).toBeLessThan(result1.score);
  });

  it('应返回三个维度的评分', () => {
    const device = createTestDevice();
    const weather = createTestWeather();
    const forecast = createTestForecast();

    const result = calculateRecommendation(device, weather, forecast);

    expect(result.dimensions.weather).toBeGreaterThanOrEqual(0);
    expect(result.dimensions.weather).toBeLessThanOrEqual(100);
    expect(result.dimensions.soil).toBeGreaterThanOrEqual(0);
    expect(result.dimensions.soil).toBeLessThanOrEqual(100);
    expect(result.dimensions.expert).toBeGreaterThanOrEqual(0);
    expect(result.dimensions.expert).toBeLessThanOrEqual(100);
  });

  it('应返回建议原因', () => {
    const device = createTestDevice();
    const weather = createTestWeather();
    const forecast = createTestForecast();

    const result = calculateRecommendation(device, weather, forecast);

    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.summary).toBeTruthy();
  });

  it('无天气数据时应使用默认值', () => {
    const device = createTestDevice();

    const result = calculateRecommendation(device, null, null);

    expect(result.dimensions.weather).toBe(50);
    expect(result.score).toBeGreaterThan(0);
  });
});
