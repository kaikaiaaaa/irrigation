import React from 'react';
import { RefreshCw, Droplets, Wind, CloudRain } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherDescription } from '@/services/weatherApi';
import type { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  onRefresh: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  isLoading,
  error,
  lastUpdated,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="text-red-500" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-red-100 rounded-lg touch-target"
          >
            <RefreshCw size={18} className="text-red-600" />
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-gray-500 text-center">暂无天气数据</p>
      </div>
    );
  }

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}小时前`;
    return `${Math.floor(diffHours / 24)}天前`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <WeatherIcon code={weather.weatherCode} size={40} />
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{Math.round(weather.temperature)}</span>
              <span className="text-lg">°C</span>
            </div>
            <p className="text-gray-500 text-sm">{getWeatherDescription(weather.weatherCode)}</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg touch-target"
          title="刷新天气"
        >
          <RefreshCw size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Droplets size={16} className="text-blue-500" />
          <span className="text-sm text-gray-600">湿度 {weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">风速 {weather.windSpeed}m/s</span>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain size={16} className="text-blue-600" />
          <span className="text-sm text-gray-600">降水 {weather.precipitation}mm</span>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          更新于 {getTimeAgo(lastUpdated)}
        </p>
      )}
    </div>
  );
};
