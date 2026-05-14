import React, { useState } from 'react';
import { Calculator, Droplets, Thermometer, Wind, CloudRain, Sprout, Ruler, Clock } from 'lucide-react';
import { CROP_TYPES, SOIL_TYPES, GROWTH_STAGES } from '@/types/device';
import { getIrrigationAdvice, getUrgencyText, getUrgencyColor } from '@/services/irrigationAdvisor';
import type { IrrigationInput } from '@/services/irrigationAdvisor';

export const QuickCheckPage: React.FC = () => {
  const [input, setInput] = useState<IrrigationInput>({
    cropType: '水稻',
    growthStage: '分蘖期',
    soilType: '壤土',
    soilMoisture: 50,
    area: 1,
    temperature: 25,
    humidity: 60,
    hasRainForecast: false,
  });
  
  const [result, setResult] = useState<ReturnType<typeof getIrrigationAdvice> | null>(null);
  
  const handleCheck = () => {
    const advice = getIrrigationAdvice(input);
    setResult(advice);
  };
  
  const handleChange = (field: keyof IrrigationInput, value: unknown) => {
    setInput(prev => ({ ...prev, [field]: value }));
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="text-primary-700" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">灌溉计算器</h1>
        <p className="text-gray-500 mt-2">输入当前条件，获取灌溉建议</p>
      </div>

      {/* 输入表单 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Sprout size={20} className="text-primary-600" />
          作物信息
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">作物类型</label>
            <select
              value={input.cropType}
              onChange={(e) => handleChange('cropType', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {CROP_TYPES.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">生育期</label>
            <select
              value={input.growthStage}
              onChange={(e) => handleChange('growthStage', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {GROWTH_STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">土壤类型</label>
          <select
            value={input.soilType}
            onChange={(e) => handleChange('soilType', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {SOIL_TYPES.map(soil => (
              <option key={soil} value={soil}>{soil}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 当前条件 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Thermometer size={20} className="text-orange-500" />
          当前条件
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">土壤湿度（%）</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={input.soilMoisture}
                onChange={(e) => handleChange('soilMoisture', parseInt(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Droplets className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">面积（亩）</label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={input.area}
                onChange={(e) => handleChange('area', parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Ruler className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">温度（°C）</label>
            <div className="relative">
              <input
                type="number"
                value={input.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Thermometer className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">空气湿度（%）</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={input.humidity}
                onChange={(e) => handleChange('humidity', parseInt(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Wind className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="rainForecast"
            checked={input.hasRainForecast}
            onChange={(e) => handleChange('hasRainForecast', e.target.checked)}
            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="rainForecast" className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <CloudRain size={18} className="text-blue-500" />
            未来24小时有降雨预报
          </label>
        </div>
      </div>

      {/* 计算按钮 */}
      <button
        onClick={handleCheck}
        className="w-full py-4 bg-primary-700 text-white rounded-xl touch-target font-semibold text-lg hover:bg-primary-800 transition-colors shadow-lg"
      >
        获取灌溉建议
      </button>

      {/* 结果展示 */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 结果头部 */}
          <div className={`p-5 border-b ${getUrgencyColor(result.urgency)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">灌溉建议</p>
                <h3 className="text-2xl font-bold mt-1">{getUrgencyText(result.urgency)}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">当前湿度</p>
                <p className="text-2xl font-bold mt-1">{result.currentMoisture}%</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* 原因 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 text-sm leading-relaxed">{result.reason}</p>
            </div>

            {/* 灌溉量 */}
            {result.shouldIrrigate && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Droplets className="mx-auto text-blue-500 mb-2" size={24} />
                  <p className="text-sm text-gray-600">每亩用水量</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">{result.irrigationAmount}</p>
                  <p className="text-xs text-gray-500">立方米/亩</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Ruler className="mx-auto text-green-500 mb-2" size={24} />
                  <p className="text-sm text-gray-600">总用水量</p>
                  <p className="text-xl font-bold text-green-700 mt-1">{result.totalAmount}</p>
                  <p className="text-xs text-gray-500">立方米</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <Clock className="mx-auto text-orange-500 mb-2" size={24} />
                  <p className="text-sm text-gray-600">预计时长</p>
                  <p className="text-xl font-bold text-orange-700 mt-1">{result.duration}</p>
                  <p className="text-xs text-gray-500">分钟</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Sprout className="mx-auto text-purple-500 mb-2" size={24} />
                  <p className="text-sm text-gray-600">目标湿度</p>
                  <p className="text-xl font-bold text-purple-700 mt-1">{result.targetMoisture}%</p>
                  <p className="text-xs text-gray-500">适宜范围</p>
                </div>
              </div>
            )}

            {/* 建议列表 */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">详细建议</h4>
              {result.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
