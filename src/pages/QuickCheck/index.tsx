import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Droplets,
  CloudRain,
  Sprout,
  Ruler,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Save,
  History,
  Trash2,
  Beaker,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import { CROP_TYPES, SOIL_TYPES, GROWTH_STAGES } from '@/types/device';
import { getIrrigationAdvice, getUrgencyText, getUrgencyColor } from '@/services/irrigationAdvisor';
import type { IrrigationInput } from '@/services/irrigationAdvisor';

interface SavedConfig {
  id: string;
  name: string;
  input: IrrigationInput;
  createdAt: string;
}

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
  const [showTips, setShowTips] = useState(true);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('irrigation-configs');
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch {
        console.error('Failed to load saved configs');
      }
    }
  }, []);

  const handleCheck = () => {
    const advice = getIrrigationAdvice(input);
    setResult(advice);
    setShowTips(true);
  };

  const handleChange = (field: keyof IrrigationInput, value: unknown) => {
    setInput((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const saveConfig = () => {
    if (!saveName.trim()) return;

    const newConfig: SavedConfig = {
      id: Date.now().toString(),
      name: saveName.trim(),
      input: { ...input },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedConfigs, newConfig];
    setSavedConfigs(updated);
    localStorage.setItem('irrigation-configs', JSON.stringify(updated));
    setSaveName('');
    setShowSaveDialog(false);
  };

  const loadConfig = (config: SavedConfig) => {
    setInput(config.input);
    setResult(null);
    setShowSaved(false);
  };

  const deleteConfig = (id: string) => {
    const updated = savedConfigs.filter((c) => c.id !== id);
    setSavedConfigs(updated);
    localStorage.setItem('irrigation-configs', JSON.stringify(updated));
  };

  const moisturePercent = Math.min(100, Math.max(0, input.soilMoisture));
  const moistureColor =
    moisturePercent < 30 ? 'bg-red-500' : moisturePercent < 60 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="space-y-6 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#5e6ad2] to-[#6872e3] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#5e6ad2]/20">
          <Calculator className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-[#f7f8f8] tracking-tight">智能灌溉计算器</h1>
        <p className="text-[#6b7280] mt-2 text-sm">基于土壤物理学和作物生理学的精准灌溉建议</p>
      </div>

      {/* Save/Load Config */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0c0c0e] border border-[#1f1f22] rounded-xl text-sm font-medium text-[#9ca3af] hover:text-[#f7f8f8] hover:border-[#2a2a2e] transition-all"
        >
          <History size={16} />
          历史配置 ({savedConfigs.length})
        </button>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0c0c0e] border border-[#1f1f22] rounded-xl text-sm font-medium text-[#9ca3af] hover:text-[#f7f8f8] hover:border-[#2a2a2e] transition-all"
        >
          <Save size={16} />
          保存配置
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111113] border border-[#1f1f22] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-[#f7f8f8] mb-4">保存配置</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="输入配置名称（如：一号地块）"
              className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#1f1f22] rounded-xl text-[#f7f8f8] placeholder-[#4b5563] focus:outline-none focus:border-[#5e6ad2] transition-colors mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 py-2.5 border border-[#1f1f22] rounded-xl text-sm text-[#9ca3af] hover:text-[#f7f8f8] hover:border-[#2a2a2e] transition-all"
              >
                取消
              </button>
              <button
                onClick={saveConfig}
                disabled={!saveName.trim()}
                className="flex-1 py-2.5 bg-[#5e6ad2] text-white rounded-xl text-sm font-medium hover:bg-[#6872e3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Configs List */}
      {showSaved && savedConfigs.length > 0 && (
        <div className="bg-[#0c0c0e] border border-[#1f1f22] rounded-xl p-4 space-y-2">
          <h3 className="text-xs font-medium text-[#6b7280] uppercase tracking-wider mb-3">点击加载配置</h3>
          {savedConfigs.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between p-3 bg-[#111113] rounded-lg hover:bg-[#16161a] cursor-pointer group transition-colors"
              onClick={() => loadConfig(config)}
            >
              <div>
                <p className="font-medium text-sm text-[#f7f8f8]">{config.name}</p>
                <p className="text-xs text-[#6b7280]">
                  {config.input.cropType} · {config.input.growthStage} · {config.input.area}亩
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConfig(config.id);
                }}
                className="p-2 text-[#4b5563] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Crop Info Card */}
      <div className="bg-[#0c0c0e] border border-[#1f1f22] rounded-xl p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 bg-[#5e6ad2]/10 rounded-lg flex items-center justify-center">
            <Sprout size={16} className="text-[#5e6ad2]" />
          </div>
          <h2 className="font-semibold text-[#f7f8f8]">作物信息</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5 uppercase tracking-wider">作物类型</label>
            <select
              value={input.cropType}
              onChange={(e) => handleChange('cropType', e.target.value)}
              className="w-full px-3 py-2.5 bg-[#111113] border border-[#1f1f22] rounded-lg text-[#f7f8f8] text-sm focus:outline-none focus:border-[#5e6ad2] transition-colors"
            >
              {CROP_TYPES.map((crop) => (
                <option key={crop} value={crop} className="bg-[#111113]">{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5 uppercase tracking-wider">生育期</label>
            <select
              value={input.growthStage}
              onChange={(e) => handleChange('growthStage', e.target.value)}
              className="w-full px-3 py-2.5 bg-[#111113] border border-[#1f1f22] rounded-lg text-[#f7f8f8] text-sm focus:outline-none focus:border-[#5e6ad2] transition-colors"
            >
              {GROWTH_STAGES.map((stage) => (
                <option key={stage} value={stage} className="bg-[#111113]">{stage}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-[#6b7280] mb-2 uppercase tracking-wider">土壤类型</label>
          <div className="grid grid-cols-3 gap-2">
            {SOIL_TYPES.map((soil) => (
              <button
                key={soil}
                onClick={() => handleChange('soilType', soil)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  input.soilType === soil
                    ? 'bg-[#5e6ad2] text-white'
                    : 'bg-[#111113] text-[#9ca3af] border border-[#1f1f22] hover:border-[#2a2a2e] hover:text-[#f7f8f8]'
                }`}
              >
                {soil}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="bg-[#0c0c0e] border border-[#1f1f22] rounded-xl p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Gauge size={16} className="text-orange-400" />
          </div>
          <h2 className="font-semibold text-[#f7f8f8]">当前条件</h2>
        </div>

        {/* Soil Moisture - with slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">土壤湿度</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#f7f8f8]">{input.soilMoisture}</span>
              <span className="text-sm text-[#6b7280]">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={input.soilMoisture}
            onChange={(e) => handleChange('soilMoisture', parseInt(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-xs text-[#4b5563] mb-2">
            <span>0%</span>
            <span>萎蔫</span>
            <span>50%</span>
            <span>饱和</span>
            <span>100%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-[#1f1f22]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${moistureColor}`}
              style={{ width: `${moisturePercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5 uppercase tracking-wider">面积</label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={input.area}
                onChange={(e) => handleChange('area', parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#111113] border border-[#1f1f22] rounded-lg text-[#f7f8f8] text-sm focus:outline-none focus:border-[#5e6ad2] transition-colors pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">亩</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5 uppercase tracking-wider">温度</label>
            <div className="relative">
              <input
                type="number"
                value={input.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#111113] border border-[#1f1f22] rounded-lg text-[#f7f8f8] text-sm focus:outline-none focus:border-[#5e6ad2] transition-colors pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">°C</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5 uppercase tracking-wider">空气湿度</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={input.humidity}
                onChange={(e) => handleChange('humidity', parseInt(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#111113] border border-[#1f1f22] rounded-lg text-[#f7f8f8] text-sm focus:outline-none focus:border-[#5e6ad2] transition-colors pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">%</span>
            </div>
          </div>

          <div className="flex items-end">
            <label
              className={`flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg cursor-pointer transition-all text-sm ${
                input.hasRainForecast
                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                  : 'bg-[#111113] border border-[#1f1f22] text-[#6b7280] hover:border-[#2a2a2e]'
              }`}
            >
              <input
                type="checkbox"
                checked={input.hasRainForecast}
                onChange={(e) => handleChange('hasRainForecast', e.target.checked)}
                className="w-4 h-4"
              />
              <CloudRain size={16} />
              <span>降雨预报</span>
            </label>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCheck}
        className="w-full py-4 bg-[#5e6ad2] text-white rounded-xl font-semibold text-base hover:bg-[#6872e3] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Beaker size={20} />
        获取灌溉建议
        <ArrowRight size={18} />
      </button>

      {/* Results */}
      {result && (
        <div className="bg-[#0c0c0e] border border-[#1f1f22] rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Result Header */}
          <div className={`p-6 ${getUrgencyColor(result.urgency).bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.urgency === 'no' ? (
                  <CheckCircle2 className={getUrgencyColor(result.urgency).icon} size={28} />
                ) : (
                  <AlertCircle className={getUrgencyColor(result.urgency).icon} size={28} />
                )}
                <div>
                  <p className={`text-xs font-medium ${getUrgencyColor(result.urgency).text} opacity-70 uppercase tracking-wider`}>
                    灌溉建议
                  </p>
                  <h3 className={`text-xl font-bold ${getUrgencyColor(result.urgency).text}`}>
                    {getUrgencyText(result.urgency)}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs ${getUrgencyColor(result.urgency).text} opacity-70 uppercase tracking-wider`}>有效水分</p>
                <p className={`text-xl font-bold ${getUrgencyColor(result.urgency).text}`}>
                  {result.availableWater}%
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Reason */}
            <div className="bg-[#111113] rounded-lg p-4 border border-[#1f1f22]">
              <p className="text-[#9ca3af] text-sm leading-relaxed">{result.reason}</p>
            </div>

            {/* Data Cards */}
            {result.shouldIrrigate && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-center">
                  <Droplets className="mx-auto text-blue-400 mb-2" size={22} />
                  <p className="text-xs text-[#6b7280] mb-1">每亩用水量</p>
                  <p className="text-xl font-bold text-blue-400">{result.irrigationAmount}</p>
                  <p className="text-xs text-[#4b5563]">立方米/亩</p>
                </div>

                <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 text-center">
                  <Ruler className="mx-auto text-green-400 mb-2" size={22} />
                  <p className="text-xs text-[#6b7280] mb-1">总用水量</p>
                  <p className="text-xl font-bold text-green-400">{result.totalAmount}</p>
                  <p className="text-xs text-[#4b5563]">立方米</p>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4 text-center">
                  <Clock className="mx-auto text-orange-400 mb-2" size={22} />
                  <p className="text-xs text-[#6b7280] mb-1">预计时长</p>
                  <p className="text-xl font-bold text-orange-400">{result.duration}</p>
                  <p className="text-xs text-[#4b5563]">分钟</p>
                </div>

                <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 text-center">
                  <Sprout className="mx-auto text-purple-400 mb-2" size={22} />
                  <p className="text-xs text-[#6b7280] mb-1">日需水量</p>
                  <p className="text-xl font-bold text-purple-400">{result.dailyWaterNeed}</p>
                  <p className="text-xs text-[#4b5563]">mm/天</p>
                </div>
              </div>
            )}

            {/* Moisture Comparison */}
            <div className="bg-[#111113] rounded-lg p-4 border border-[#1f1f22]">
              <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-3">土壤湿度对比</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#9ca3af]">当前 {result.currentMoisture}%</span>
                    <span className="text-[#5e6ad2] font-medium">目标 {result.targetMoisture}%</span>
                  </div>
                  <div className="h-2 bg-[#1f1f22] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5e6ad2] rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (result.currentMoisture / result.targetMoisture) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tips List */}
            <div>
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center justify-between w-full py-2 text-left group"
              >
                <h4 className="font-semibold text-[#f7f8f8] text-sm">详细建议</h4>
                {showTips ? (
                  <ChevronUp size={16} className="text-[#4b5563] group-hover:text-[#9ca3af] transition-colors" />
                ) : (
                  <ChevronDown size={16} className="text-[#4b5563] group-hover:text-[#9ca3af] transition-colors" />
                )}
              </button>

              {showTips && (
                <div className="space-y-2 mt-3">
                  {result.tips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-[#111113] rounded-lg border border-[#1f1f22] text-sm text-[#9ca3af]"
                    >
                      <span className="flex-shrink-0 w-5 h-5 bg-[#5e6ad2]/10 text-[#5e6ad2] rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
