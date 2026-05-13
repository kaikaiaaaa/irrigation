import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData } from '@/services/weatherApi';
import { useWeatherStore } from '@/stores/weatherStore';
import type { WeatherData, WeatherForecast } from '@/types/weather';

interface UseWeatherReturn {
  current: WeatherData | null;
  forecast: WeatherForecast | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refetch: () => Promise<void>;
}

export function useWeather(latitude: number, longitude: number): UseWeatherReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const weatherCache = useWeatherStore(state => state.weatherCache);
  const setWeather = useWeatherStore(state => state.setWeather);
  const isCacheValid = useWeatherStore(state => state.isCacheValid);

  const deviceId = `${latitude},${longitude}`;
  const cached = weatherCache[deviceId];

  const fetchWeather = useCallback(async () => {
    // 如果缓存有效，不重新获取
    if (isCacheValid(deviceId)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { current, forecast } = await fetchWeatherData(latitude, longitude);
      setWeather(deviceId, current, forecast);
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取天气数据失败';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, deviceId, isCacheValid, setWeather]);

  // 组件挂载时自动获取
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    current: cached?.current ?? null,
    forecast: cached?.forecast ?? null,
    isLoading,
    error,
    lastUpdated: cached?.lastUpdated ?? null,
    refetch: fetchWeather,
  };
}
