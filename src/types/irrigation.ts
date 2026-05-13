export type RecommendationType = 'WATER' | 'DELAY' | 'SKIP' | 'MONITOR';

export interface DimensionScore {
  weather: number; // 0-100
  soil: number; // 0-100
  expert: number; // 0-100
}

export interface RecommendationReason {
  dimension: 'weather' | 'soil' | 'expert';
  text: string;
  impact: 'positive' | 'negative' | 'neutral';
  value?: string;
}

export interface RecommendationResult {
  type: RecommendationType;
  score: number; // 0-100
  dimensions: DimensionScore;
  reasons: RecommendationReason[];
  summary: string;
  timestamp: string;
}

export const RECOMMENDATION_CONFIG = {
  // 分数阈值
  thresholds: {
    SKIP: 25, // 0-25: 无需灌溉
    DELAY: 50, // 26-50: 延迟灌溉
    MONITOR: 75, // 51-75: 监控中
    WATER: 100, // 76-100: 建议灌溉
  },
  // 权重
  weights: {
    weather: 0.3,
    soil: 0.4,
    expert: 0.3,
  },
  // 推荐类型标签
  labels: {
    WATER: { text: '建议灌溉', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-200' },
    DELAY: { text: '延迟灌溉', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
    SKIP: { text: '无需灌溉', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-200' },
    MONITOR: { text: '继续监控', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-200' },
  },
};
