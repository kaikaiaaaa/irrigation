export interface WeatherData {
  temperature: number; // 摄氏度
  humidity: number; // 百分比
  precipitation: number; // 毫米
  windSpeed: number; // 米/秒
  weatherCode: number; // WMO weather code
  timestamp: string; // ISO date string
}

export interface WeatherForecast {
  hourly: {
    time: string[];
    temperature2m: number[];
    humidity2m: number[];
    precipitation: number[];
    precipitationProbability: number[];
    weatherCode: number[];
  };
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    precipitationSum: number[];
  };
}

export interface WeatherCache {
  current: WeatherData | null;
  forecast: WeatherForecast | null;
  lastUpdated: string | null;
  expiresAt: string | null;
}
