import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'warning' | 'destructive' | 'success';
}

const variantClasses = {
  default: 'border-l-4 border-l-border',
  primary: 'border-l-4 border-l-primary',
  warning: 'border-l-4 border-l-warning',
  destructive: 'border-l-4 border-l-destructive',
  success: 'border-l-4 border-l-success',
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, variant = 'default' }) => {
  return (
    <div className={`stat-card ${variantClasses[variant]}`}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};
