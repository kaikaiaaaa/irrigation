import { create } from 'zustand';
import type { WeatherData, WeatherForecast } from '@/types/weather';

interface WeatherState {
  weatherCache: Record<string, {
    current: WeatherData | null;
    forecast: WeatherForecast | null;
    lastUpdated: string | null;
  }>;
  setWeather: (deviceId: string, current: WeatherData, forecast: WeatherForecast) => void;
  getWeather: (deviceId: string) => {
    current: WeatherData | null;
    forecast: WeatherForecast | null;
    lastUpdated: string | null;
  } | undefined;
  isCacheValid: (deviceId: string) => boolean;
}

export const useWeatherStore = create<WeatherState>()((set, get) => ({
  weatherCache: {},

  setWeather: (deviceId: string, current: WeatherData, forecast: WeatherForecast) => {
    set(state => ({
      weatherCache: {
        ...state.weatherCache,
        [deviceId]: {
          current,
          forecast,
          lastUpdated: new Date().toISOString(),
        },
      },
    }));
  },

  getWeather: (deviceId: string) => {
    return get().weatherCache[deviceId];
  },

  isCacheValid: (deviceId: string) => {
    const cache = get().weatherCache[deviceId];
    if (!cache || !cache.lastUpdated) return false;
    
    const lastUpdated = new Date(cache.lastUpdated);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdated.getTime()) / (1000 * 60);
    
    // 当前天气缓存15分钟，预报缓存1小时
    return diffMinutes < 15;
  },
}));
