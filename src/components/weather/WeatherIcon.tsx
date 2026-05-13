import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';

interface WeatherIconProps {
  code: number;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, size = 24, className = '' }) => {
  // WMO Weather interpretation codes (WW)
  // 0: Clear sky
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog and depositing rime fog
  // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
  // 56, 57: Freezing Drizzle: Light and dense intensity
  // 61, 63, 65: Rain: Slight, moderate and heavy intensity
  // 66, 67: Freezing Rain: Light and heavy intensity
  // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
  // 77: Snow grains
  // 80, 81, 82: Rain showers: Slight, moderate, and violent
  // 85, 86: Snow showers slight and heavy
  // 95: Thunderstorm: Slight or moderate
  // 96, 99: Thunderstorm with slight and heavy hail

  const getIcon = () => {
    if (code === 0 || code === 1) {
      return <Sun size={size} className={`text-yellow-500 ${className}`} />;
    }
    if (code === 2 || code === 3) {
      return <Cloud size={size} className={`text-gray-500 ${className}`} />;
    }
    if (code === 45 || code === 48) {
      return <CloudFog size={size} className={`text-gray-400 ${className}`} />;
    }
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
      return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return <CloudSnow size={size} className={`text-blue-300 ${className}`} />;
    }
    if ([95, 96, 99].includes(code)) {
      return <CloudLightning size={size} className={`text-purple-500 ${className}`} />;
    }
    return <Sun size={size} className={`text-yellow-500 ${className}`} />;
  };

  return getIcon();
};
