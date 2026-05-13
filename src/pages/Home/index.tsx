import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Droplets, Calendar, ChevronRight, CloudRain } from 'lucide-react';
import { useDeviceStore } from '@/stores/deviceStore';
import { useWeatherStore } from '@/stores/weatherStore';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { EXPERT_RULES } from '@/types/device';

export const HomePage: React.FC = () => {
  const devices = useDeviceStore(state => state.devices);
  const weatherCache = useWeatherStore(state => state.weatherCache);

  const getRecommendation = (device: typeof devices[0]) => {
    const rule = EXPERT_RULES.find(r => r.cropType === device.cropType);
    if (!rule) return { text: '暂无建议', color: 'gray' };

    if (device.soilMoisture < rule.minMoisture) {
      return { text: '建议灌溉', color: 'red' };
    } else if (device.soilMoisture > rule.maxMoisture) {
      return { text: '湿度充足', color: 'green' };
    } else {
      return { text: '适度监控', color: 'yellow' };
    }
  };

  const getRecommendationColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-100 text-red-800 border-red-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的设备</h1>
          <p className="text-gray-500 mt-1">共 {devices.length} 个灌溉地块</p>
        </div>
        <Link
          to="/add"
          className="md:hidden flex items-center gap-2 bg-primary-700 text-white px-4 py-2 rounded-lg touch-target"
        >
          <Plus size={20} />
          <span>添加</span>
        </Link>
      </div>

      {/* 设备列表 */}
      <div className="space-y-4">
        {devices.map(device => {
          const recommendation = getRecommendation(device);
          
          return (
            <Link
              key={device.id}
              to={`/device/${device.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRecommendationColor(recommendation.color)}`}>
                      {recommendation.text}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Droplets size={16} className="text-blue-500" />
                      <span className="text-sm">
                        土壤湿度: {device.soilMoisture}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">
                        {device.lastIrrigationDate
                          ? `上次灌溉: ${new Date(device.lastIrrigationDate).toLocaleDateString('zh-CN')}`
                          : '尚未灌溉'}
                      </span>
                    </div>
                  </div>

                  {/* 天气信息 */}
                  {(() => {
                    const deviceId = `${device.location.latitude},${device.location.longitude}`;
                    const weather = weatherCache[deviceId];
                    if (weather?.current) {
                      return (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                          <WeatherIcon code={weather.current.weatherCode} size={18} />
                          <span className="text-sm text-gray-600">
                            {Math.round(weather.current.temperature)}°C
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="text-sm text-gray-600">
                            湿度 {weather.current.humidity}%
                          </span>
                          {weather.current.precipitation > 0 && (
                            <>
                              <CloudRain size={14} className="text-blue-500" />
                              <span className="text-sm text-blue-600">
                                {weather.current.precipitation}mm
                              </span>
                            </>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{device.cropType}</span>
                    <span>•</span>
                    <span>{device.soilType}</span>
                    <span>•</span>
                    <span>{device.area}亩</span>
                  </div>
                </div>
                
                <ChevronRight className="text-gray-400 mt-1" size={20} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 空状态 */}
      {devices.length === 0 && (
        <div className="text-center py-12">
          <Droplets className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无设备</h3>
          <p className="text-gray-500 mb-6">添加您的第一个灌溉地块，开始智能管理</p>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-lg touch-target"
          >
            <Plus size={20} />
            <span>添加设备</span>
          </Link>
        </div>
      )}
    </div>
  );
};
