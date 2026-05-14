import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-500 mt-1">关于应用</p>
      </div>

      {/* 关于应用 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center">
            <Info className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">放心灌</h2>
            <p className="text-gray-500 text-sm">智能灌溉计算器</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">版本</span>
            <span className="font-medium">v2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">功能</span>
            <span className="font-medium">灌溉量计算</span>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-3">使用方法</h3>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">1.</span>
            <span>选择作物类型和当前生育期</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">2.</span>
            <span>选择土壤类型</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">3.</span>
            <span>输入当前土壤湿度（可用土壤湿度计测量）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">4.</span>
            <span>输入灌溉面积</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">5.</span>
            <span>输入当前温度和空气湿度</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">6.</span>
            <span>点击"获取灌溉建议"查看结果</span>
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
