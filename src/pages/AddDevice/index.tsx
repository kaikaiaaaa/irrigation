import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useDeviceStore } from '@/stores/deviceStore';
import { CROP_TYPES, SOIL_TYPES, type DeviceFormData } from '@/types/device';

export const AddDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const addDevice = useDeviceStore(state => state.addDevice);
  const updateDevice = useDeviceStore(state => state.updateDevice);
  const getDeviceById = useDeviceStore(state => state.getDeviceById);
  
  const existingDevice = editId ? getDeviceById(editId) : undefined;

  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    location: { latitude: 31.2304, longitude: 121.4737 },
    cropType: '水稻',
    soilType: '壤土',
    area: 1,
    moistureThreshold: 60,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingDevice) {
      setFormData({
        name: existingDevice.name,
        location: existingDevice.location,
        cropType: existingDevice.cropType,
        soilType: existingDevice.soilType,
        area: existingDevice.area,
        moistureThreshold: existingDevice.moistureThreshold,
      });
    }
  }, [existingDevice]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入设备名称';
    }
    
    if (formData.area <= 0) {
      newErrors.area = '面积必须大于0';
    }
    
    if (formData.moistureThreshold < 0 || formData.moistureThreshold > 100) {
      newErrors.moistureThreshold = '阈值必须在0-100之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (editId) {
      updateDevice(editId, formData);
    } else {
      addDevice(formData);
    }
    
    navigate('/');
  };

  const handleChange = (field: keyof DeviceFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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
        <h1 className="text-xl font-bold">{editId ? '编辑设备' : '添加设备'}</h1>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 设备名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            设备名称 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="例如：一号地块"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* 作物类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作物类型 *
          </label>
          <select
            value={formData.cropType}
            onChange={(e) => handleChange('cropType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {CROP_TYPES.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>

        {/* 土壤类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            土壤类型 *
          </label>
          <select
            value={formData.soilType}
            onChange={(e) => handleChange('soilType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {SOIL_TYPES.map(soil => (
              <option key={soil} value={soil}>{soil}</option>
            ))}
          </select>
        </div>

        {/* 面积 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            面积（亩）*
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={formData.area}
            onChange={(e) => handleChange('area', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
        </div>

        {/* 湿度阈值 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            土壤湿度阈值（%）*
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.moistureThreshold}
            onChange={(e) => handleChange('moistureThreshold', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-gray-500 text-sm mt-1">
            当土壤湿度低于此值时，系统将建议灌溉
          </p>
          {errors.moistureThreshold && (
            <p className="text-red-500 text-sm mt-1">{errors.moistureThreshold}</p>
          )}
        </div>

        {/* 位置 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            位置
          </label>
          <input
            type="text"
            value={formData.location.address || ''}
            onChange={(e) => handleChange('location', { ...formData.location, address: e.target.value })}
            placeholder="例如：上海市浦东新区"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary-700 text-white rounded-lg touch-target font-medium text-lg"
        >
          <Save size={20} />
          <span>{editId ? '保存修改' : '添加设备'}</span>
        </button>
      </form>
    </div>
  );
};
