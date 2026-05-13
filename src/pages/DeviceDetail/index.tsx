import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Droplets, Calendar } from 'lucide-react';
import { useDeviceStore } from '@/stores/deviceStore';
import { useWeather } from '@/hooks/useWeather';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { RainForecast } from '@/components/weather/RainForecast';
import { EXPERT_RULES, SOIL_CHARACTERISTICS } from '@/types/device';

export const DeviceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const device = useDeviceStore(state => 
    id ? state.getDeviceById(id) : undefined
  );
  const deleteDevice = useDeviceStore(state => state.deleteDevice);
  const updateSoilMoisture = useDeviceStore(state => state.updateSoilMoisture);
  const markAsIrrigated = useDeviceStore(state => state.markAsIrrigated);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [moistureInput, setMoistureInput] = useState('');

  if (!device) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">设备不存在</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary-700 hover:underline"
        >
          返回首页
        </button>
      </div>
    );
  }

  const expertRule = EXPERT_RULES.find(r => r.cropType === device.cropType);
  const soilChar = SOIL_CHARACTERISTICS.find(s => s.type === device.soilType);

  const handleDelete = () => {
    deleteDevice(device.id);
    navigate('/');
  };

  const handleUpdateMoisture = () => {
    const moisture = parseInt(moistureInput);
    if (!isNaN(moisture) && moisture >= 0 && moisture <= 100) {
      updateSoilMoisture(device.id, moisture);
      setMoistureInput('');
    }
  };

  const getMoistureStatus = () => {
    if (!expertRule) return { text: '未知', color: 'text-gray-500' };
    if (device.soilMoisture < expertRule.minMoisture) {
      return { text: '偏低', color: 'text-red-600' };
    } else if (device.soilMoisture > expertRule.maxMoisture) {
      return { text: '偏高', color: 'text-yellow-600' };
    }
    return { text: '适宜', color: 'text-green-600' };
  };

  const moistureStatus = getMoistureStatus();

  // 获取天气数据
  const {
    current: weather,
    forecast,
    isLoading: weatherLoading,
    error: weatherError,
    lastUpdated,
    refetch: refetchWeather,
  } = useWeather(device.location.latitude, device.location.longitude);

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg touch-target"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{device.name}</h1>
      </div>

      {/* 天气卡片 */}
      <WeatherCard
        weather={weather}
        isLoading={weatherLoading}
        error={weatherError}
        lastUpdated={lastUpdated}
        onRefresh={refetchWeather}
      />

      {/* 降雨预报 */}
      <RainForecast forecast={forecast} />

      {/* 基本信息卡片 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">作物类型</p>
            <p className="font-medium">{device.cropType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">土壤类型</p>
            <p className="font-medium">{device.soilType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">面积</p>
            <p className="font-medium">{device.area} 亩</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">位置</p>
            <p className="font-medium">{device.location.address || '未设置'}</p>
          </div>
        </div>

        {soilChar && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">{soilChar.description}</p>
          </div>
        )}
      </div>

      {/* 土壤湿度 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-500" size={20} />
            <h2 className="font-semibold">土壤湿度</h2>
          </div>
          <span className={`font-bold ${moistureStatus.color}`}>
            {moistureStatus.text}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>当前湿度</span>
              <span className="font-bold">{device.soilMoisture}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${device.soilMoisture}%` }}
              />
            </div>
          </div>
        </div>

        {expertRule && (
          <p className="text-sm text-gray-500 mb-4">
            建议范围: {expertRule.minMoisture}% - {expertRule.maxMoisture}%
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="100"
            value={moistureInput}
            onChange={(e) => setMoistureInput(e.target.value)}
            placeholder="输入新湿度值"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleUpdateMoisture}
            className="px-4 py-2 bg-primary-700 text-white rounded-lg touch-target"
          >
            更新
          </button>
        </div>
      </div>

      {/* 灌溉记录 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-gray-500" size={20} />
          <h2 className="font-semibold">灌溉记录</h2>
        </div>

        <p className="text-gray-600 mb-4">
          {device.lastIrrigationDate
            ? `上次灌溉: ${new Date(device.lastIrrigationDate).toLocaleString('zh-CN')}`
            : '尚未记录灌溉'}
        </p>

        <button
          onClick={() => markAsIrrigated(device.id)}
          className="w-full py-3 bg-blue-600 text-white rounded-lg touch-target font-medium"
        >
          标记为已灌溉
        </button>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/add?edit=${device.id}`)}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg touch-target"
        >
          <Edit2 size={18} />
          <span>编辑</span>
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-300 text-red-600 rounded-lg touch-target"
        >
          <Trash2 size={18} />
          <span>删除</span>
        </button>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">确认删除</h3>
            <p className="text-gray-600 mb-6">
              确定要删除 "{device.name}" 吗？此操作不可撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg touch-target"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg touch-target"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
