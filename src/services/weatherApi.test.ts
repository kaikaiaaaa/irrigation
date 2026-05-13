import { describe, it, expect, vi } from 'vitest';
import { fetchWeatherData, getWeatherDescription, isRainy, isClear } from '@/services/weatherApi';

// Mock fetch globally
const mockFetch = (data: unknown) => {
  (globalThis as unknown as { fetch: typeof fetch }).fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);
};

describe('天气API服务', () => {
  it('应正确解析天气数据', async () => {
    const mockResponse = {
      latitude: 31.23,
      longitude: 121.47,
      current: {
        time: '2025-05-13T10:00',
        temperature_2m: 25.5,
        relative_humidity_2m: 65,
        precipitation: 0,
        weather_code: 1,
        wind_speed_10m: 3.2,
      },
      hourly: {
        time: Array.from({ length: 48 }, (_, i) => `2025-05-13T${String(i).padStart(2, '0')}:00`),
        temperature_2m: Array(48).fill(25),
        relative_humidity_2m: Array(48).fill(60),
        precipitation_probability: Array(48).fill(20),
        precipitation: Array(48).fill(0),
        weather_code: Array(48).fill(1),
      },
    };

    mockFetch(mockResponse);

    const result = await fetchWeatherData(31.2304, 121.4737);

    expect(result.current.temperature).toBe(25.5);
    expect(result.current.humidity).toBe(65);
    expect(result.current.weatherCode).toBe(1);
  });

  it('应处理API错误', async () => {
    (globalThis as unknown as { fetch: typeof fetch }).fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(fetchWeatherData(31.2304, 121.4737)).rejects.toThrow('天气数据获取失败');
  });

  it('应正确判断天气代码', () => {
    expect(isClear(0)).toBe(true);
    expect(isClear(1)).toBe(true);
    expect(isClear(2)).toBe(false);

    expect(isRainy(61)).toBe(true);
    expect(isRainy(80)).toBe(true);
    expect(isRainy(0)).toBe(false);
  });

  it('应返回中文天气描述', () => {
    expect(getWeatherDescription(0)).toBe('晴朗');
    expect(getWeatherDescription(61)).toBe('小雨');
    expect(getWeatherDescription(95)).toBe('雷雨');
    expect(getWeatherDescription(999)).toBe('未知');
  });
});
