import type { WeatherData, WeatherForecast } from '@/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
  };
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<{ current: WeatherData; forecast: WeatherForecast }> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code',
    forecast_days: '2',
    timezone: 'auto',
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`天气数据获取失败: ${response.status} ${response.statusText}`);
  }

  const data: OpenMeteoResponse = await response.json();

  const current: WeatherData = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    timestamp: data.current.time,
  };

  // 只取未来24小时的数据
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const hourlyIndices = data.hourly.time
    .map((time, index) => ({ time: new Date(time), index }))
    .filter(({ time }) => time >= now && time <= next24h)
    .map(({ index }) => index);

  const forecast: WeatherForecast = {
    hourly: {
      time: hourlyIndices.map(i => data.hourly.time[i]),
      temperature2m: hourlyIndices.map(i => data.hourly.temperature_2m[i]),
      humidity2m: hourlyIndices.map(i => data.hourly.relative_humidity_2m[i]),
      precipitation: hourlyIndices.map(i => data.hourly.precipitation[i]),
      precipitationProbability: hourlyIndices.map(i => data.hourly.precipitation_probability[i]),
      weatherCode: hourlyIndices.map(i => data.hourly.weather_code[i]),
    },
    daily: {
      time: [data.hourly.time[0]],
      temperatureMax: [Math.max(...data.hourly.temperature_2m.slice(0, 24))],
      temperatureMin: [Math.min(...data.hourly.temperature_2m.slice(0, 24))],
      precipitationSum: [data.hourly.precipitation.slice(0, 24).reduce((a, b) => a + b, 0)],
    },
  };

  return { current, forecast };
}

// WMO Weather code to description mapping
export function getWeatherDescription(code: number): string {
  const codes: Record<number, string> = {
    0: '晴朗',
    1: ' mainly clear',
    2: '多云',
    3: '阴天',
    45: '雾',
    48: '雾凇',
    51: '毛毛雨',
    53: '中雨',
    55: '大雨',
    56: '冻雨',
    57: '强冻雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    66: '冻雨',
    67: '强冻雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '雪粒',
    80: '阵雨',
    81: '强阵雨',
    82: '暴雨',
    85: '阵雪',
    86: '强阵雪',
    95: '雷雨',
    96: '雷雨伴冰雹',
    99: '强雷雨伴冰雹',
  };
  return codes[code] || '未知';
}

// Check if weather code indicates rain
export function isRainy(code: number): boolean {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

// Check if weather code indicates clear/sunny
export function isClear(code: number): boolean {
  return [0, 1].includes(code);
}
