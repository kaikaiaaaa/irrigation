import React, { useState, useRef, useCallback } from 'react';
import { 
  Info, 
  ExternalLink, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useDeviceStore } from '@/stores/deviceStore';
import { exportDevices, importDevices } from '@/utils/exportImport';
import { getStorageInfo, formatStorageSize } from '@/utils/storage';
import type { ImportResult } from '@/utils/exportImport';

export const SettingsPage: React.FC = () => {
  const devices = useDeviceStore(state => state.devices);
  const setDevices = useDeviceStore(state => state.setDevices);
  const clearDevices = useDeviceStore(state => state.clearDevices);
  
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const storageInfo = getStorageInfo();

  const handleExport = () => {
    exportDevices(devices);
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importDevices(file);
    setImportResult(result);
    
    if (result.success) {
      setShowImportPreview(true);
    }
  }, []);

  const handleImportConfirm = () => {
    if (importResult?.success) {
      setDevices(importResult.devices);
      setShowImportPreview(false);
      setImportResult(null);
    }
  };

  const handleClearData = () => {
    clearDevices();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-500 mt-1">应用配置和数据管理</p>
      </div>

      {/* 数据管理 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h2 className="font-semibold text-lg">数据管理</h2>
        
        {/* 存储空间 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">存储空间使用</span>
            <span className={`font-medium ${storageInfo.isWarning ? 'text-red-600' : 'text-gray-900'}`}>
              {storageInfo.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                storageInfo.isCritical ? 'bg-red-500' : storageInfo.isWarning ? 'bg-yellow-500' : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {formatStorageSize(storageInfo.used)} / {formatStorageSize(storageInfo.total)}
          </p>
          {storageInfo.isWarning && (
            <div className="flex items-center gap-2 text-yellow-700 text-sm">
              <AlertTriangle size={16} />
              <span>存储空间不足，建议导出数据</span>
            </div>
          )}
        </div>

        {/* 导出/导入按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg touch-target hover:bg-gray-50"
          >
            <Download size={18} />
            <span>导出数据</span>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg touch-target hover:bg-gray-50"
          >
            <Upload size={18} />
            <span>导入数据</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* 导入结果 */}
        {importResult && !showImportPreview && (
          <div className={`p-3 rounded-lg ${importResult.success ? 'bg-red-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="text-green-500" size={18} />
              ) : (
                <XCircle className="text-red-500" size={18} />
              )}
              <span className={importResult.success ? 'text-green-700' : 'text-red-700'}>
                {importResult.success ? '导入成功' : importResult.error}
              </span>
            </div>
            {importResult.warnings.length > 0 && (
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                {importResult.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 导入预览 */}
        {showImportPreview && importResult?.success && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <p className="font-medium text-blue-900">
              找到 {importResult.devices.length} 个设备，是否导入？
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleImportConfirm}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg touch-target"
              >
                确认导入
              </button>
              <button
                onClick={() => {
                  setShowImportPreview(false);
                  setImportResult(null);
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg touch-target"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 清除数据 */}
        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-300 text-red-600 rounded-lg touch-target hover:bg-red-50"
        >
          <Trash2 size={18} />
          <span>清除所有数据</span>
        </button>
      </div>

      {/* 清除确认对话框 */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">确认清除</h3>
            </div>
            <p className="text-gray-600">
              这将删除所有设备数据，此操作不可撤销。建议先导出数据备份。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg touch-target"
              >
                取消
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg touch-target"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 关于应用 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center">
            <Info className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">放心灌</h2>
            <p className="text-gray-500 text-sm">智能灌溉决策助手</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">版本</span>
            <span className="font-medium">v1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">设备数量</span>
            <span className="font-medium">{devices.length} 个</span>
          </div>
        </div>
      </div>

      {/* GitHub 链接 */}
      <a
        href="https://github.com/kaikaiaaaa/irrigation"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <ExternalLink className="text-gray-700" size={24} />
        <div>
          <p className="font-medium">开源代码</p>
          <p className="text-gray-500 text-sm">github.com/kaikaiaaaa/irrigation</p>
        </div>
      </a>
    </div>
  );
};
