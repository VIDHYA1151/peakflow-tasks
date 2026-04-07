import React from 'react';

interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, size = 'sm', showLabel = true }) => {
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const color = value >= 80 ? 'bg-success' : value >= 50 ? 'bg-info' : value >= 25 ? 'bg-warning' : 'bg-destructive';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-muted rounded-full ${h} overflow-hidden`}>
        <div className={`${h} ${color} rounded-full transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      {showLabel && <span className="text-xs font-medium text-muted-foreground w-8 text-right">{value}%</span>}
    </div>
  );
};
