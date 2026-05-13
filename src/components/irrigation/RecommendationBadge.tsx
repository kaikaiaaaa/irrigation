import React from 'react';
import type { RecommendationType } from '@/types/irrigation';
import { RECOMMENDATION_CONFIG } from '@/types/irrigation';
import { Droplets, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface RecommendationBadgeProps {
  type: RecommendationType;
  size?: 'sm' | 'md';
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({ 
  type, 
  size = 'md' 
}) => {
  const config = RECOMMENDATION_CONFIG.labels[type];
  
  const icons = {
    WATER: Droplets,
    DELAY: Clock,
    SKIP: CheckCircle,
    MONITOR: AlertCircle,
  };
  
  const Icon = icons[type];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} font-medium`}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      {config.text}
    </span>
  );
};
