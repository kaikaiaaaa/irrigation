import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sun, Droplets, BookOpen } from 'lucide-react';
import type { RecommendationResult } from '@/types/irrigation';
import { RecommendationBadge } from './RecommendationBadge';

interface RecommendationDetailProps {
  recommendation: RecommendationResult;
}

export const RecommendationDetail: React.FC<RecommendationDetailProps> = ({
  recommendation,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { type, score, dimensions, reasons, summary } = recommendation;

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case 'weather':
        return <Sun size={16} className="text-yellow-500" />;
      case 'soil':
        return <Droplets size={16} className="text-blue-500" />;
      case 'expert':
        return <BookOpen size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getDimensionLabel = (dimension: string) => {
    switch (dimension) {
      case 'weather':
        return '天气';
      case 'soil':
        return '土壤';
      case 'expert':
        return '专家';
      default:
        return dimension;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-red-600';
      case 'negative':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <RecommendationBadge type={type} size="md" />
          <span className="text-2xl font-bold text-gray-900">{score}分</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{summary}</p>

      {/* 三维度分数 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {Object.entries(dimensions).map(([key, value]) => (
          <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-1">{getDimensionIcon(key)}</div>
            <p className="text-xs text-gray-500">{getDimensionLabel(key)}</p>
            <p className="text-lg font-bold">{value}分</p>
          </div>
        ))}
      </div>

      {/* 展开详情 */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg touch-target"
      >
        <span>{showBreakdown ? '收起详情' : '查看详情'}</span>
        {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showBreakdown && (
        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-gray-900">建议依据</h4>
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="mt-0.5">{getDimensionIcon(reason.dimension)}</div>
              <div className="flex-1">
                <p className={`text-sm ${getImpactColor(reason.impact)}`}>
                  {reason.text}
                </p>
                {reason.value && (
                  <p className="text-xs text-gray-500 mt-1">数值: {reason.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
