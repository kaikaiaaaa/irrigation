import React from 'react';
import { CloudRain } from 'lucide-react';
import type { WeatherForecast } from '@/types/weather';

interface RainForecastProps {
  forecast: WeatherForecast | null;
}

export const RainForecast: React.FC<RainForecastProps> = ({ forecast }) => {
  if (!forecast) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-gray-500 text-center">暂无预报数据</p>
      </div>
    );
  }

  const { hourly } = forecast;
  
  // 计算未来24小时的降雨概率
  const maxProbability = Math.max(...hourly.precipitationProbability);
  const avgProbability = Math.round(
    hourly.precipitationProbability.reduce((a, b) => a + b, 0) / hourly.precipitationProbability.length
  );

  // 找出降雨概率最高的时段
  const maxIndex = hourly.precipitationProbability.indexOf(maxProbability);
  const maxTime = new Date(hourly.time[maxIndex]).toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <CloudRain className="text-blue-500" size={20} />
        <h3 className="font-semibold">24小时降雨预报</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">平均降雨概率</span>
          <span className={`font-bold ${avgProbability > 50 ? 'text-red-600' : 'text-blue-600'}`}>
            {avgProbability}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">最高降雨概率</span>
          <span className={`font-bold ${maxProbability > 50 ? 'text-red-600' : 'text-blue-600'}`}>
            {maxProbability}%
          </span>
        </div>

        {maxProbability > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">最高概率时段</span>
            <span className="font-medium">{maxTime}</span>
          </div>
        )}

        {/* 降雨概率可视化 */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">未来24小时降雨概率</p>
          <div className="flex gap-1 h-16">
            {hourly.precipitationProbability
              .filter((_, i) => i % 3 === 0) // 每3小时显示一个点
              .map((prob, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end items-center"
                >
                  <div
                    className={`w-full rounded-t ${
                      prob > 50 ? 'bg-red-400' : prob > 20 ? 'bg-blue-400' : 'bg-blue-200'
                    }`}
                    style={{ height: `${prob}%` }}
                  />
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(hourly.time[i * 3]).getHours()}时
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
