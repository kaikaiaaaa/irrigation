import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-500 mt-1">应用配置和关于信息</p>
      </div>

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
            <span className="text-gray-600">技术栈</span>
            <span className="font-medium">React + Vite + TypeScript</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">数据存储</span>
            <span className="font-medium">浏览器本地存储</span>
          </div>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-3">核心功能</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>基于天气、土壤湿度和专家知识的综合灌溉建议</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>多设备管理，支持不同作物和土壤类型</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>实时天气数据集成（Open-Meteo）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>土壤湿度手动记录和跟踪</span>
          </li>
        </ul>
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
