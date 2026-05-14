import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
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
    location: { latitude: 31.2304, longitude: 121.4737, address: '' },
    cropType: '水稻',
    soilType: '壤土',
    area: 1,
    soilMoisture: 50,
    moistureThreshold: 60,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (existingDevice) {
      setFormData({
        name: existingDevice.name,
        location: existingDevice.location,
        cropType: existingDevice.cropType,
        soilType: existingDevice.soilType,
        area: existingDevice.area,
        soilMoisture: existingDevice.soilMoisture,
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
    
    if (formData.soilMoisture < 0 || formData.soilMoisture > 100) {
      newErrors.soilMoisture = '土壤湿度必须在0-100之间';
    }
    
    if (formData.moistureThreshold < 0 || formData.moistureThreshold > 100) {
      newErrors.moistureThreshold = '阈值必须在0-100之间';
    }
    
    if (formData.location.latitude < -90 || formData.location.latitude > 90) {
      newErrors.latitude = '纬度必须在-90到90之间';
    }
    
    if (formData.location.longitude < -180 || formData.location.longitude > 180) {
      newErrors.longitude = '经度必须在-180到180之间';
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
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLocationChange = (field: 'latitude' | 'longitude' | 'address', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: '浏览器不支持定位' }));
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: parseFloat(position.coords.latitude.toFixed(4)),
            longitude: parseFloat(position.coords.longitude.toFixed(4)),
          }
        }));
        setLocationLoading(false);
      },
      (err) => {
        setErrors(prev => ({ ...prev, location: `定位失败: ${err.message}` }));
        setLocationLoading(false);
      }
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg touch-target"
        >
          <ArrowLeft size={20} className="md:w-6 md:h-6" />
        </button>
        <h1 className="text-lg md:text-xl font-bold">{editId ? '编辑设备' : '添加设备'}</h1>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* 位置信息 */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" />
              <h3 className="font-medium text-gray-900">位置信息</h3>
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="text-sm text-primary-700 hover:text-primary-800 disabled:opacity-50"
            >
              {locationLoading ? '定位中...' : '获取当前位置'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">纬度</label>
              <input
                type="number"
                step="0.0001"
                value={formData.location.latitude}
                onChange={(e) => handleLocationChange('latitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">经度</label>
              <input
                type="number"
                step="0.0001"
                value={formData.location.longitude}
                onChange={(e) => handleLocationChange('longitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">地址描述</label>
            <input
              type="text"
              value={formData.location.address || ''}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              placeholder="例如：上海市浦东新区"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
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

        {/* 土壤湿度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            当前土壤湿度（%）*
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.soilMoisture}
            onChange={(e) => handleChange('soilMoisture', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-gray-500 text-sm mt-1">
            请输入当前实测的土壤湿度值（0-100%）
          </p>
          {errors.soilMoisture && (
            <p className="text-red-500 text-sm mt-1">{errors.soilMoisture}</p>
          )}
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

        {/* 提交按钮 */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 md:py-4 bg-primary-700 text-white rounded-lg touch-target font-medium text-base md:text-lg"
        >
          <Save size={20} />
          <span>{editId ? '保存修改' : '添加设备'}</span>
        </button>
      </form>
    </div>
  );
};
