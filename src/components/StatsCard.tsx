import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'warning' | 'destructive' | 'success' | 'info';
}

const variantStyles = {
  default: { bg: 'bg-card', icon: 'bg-muted text-muted-foreground', border: 'border' },
  primary: { bg: 'bg-card', icon: 'bg-primary/10 text-primary', border: 'border' },
  warning: { bg: 'bg-card', icon: 'bg-warning/10 text-warning', border: 'border' },
  destructive: { bg: 'bg-card', icon: 'bg-destructive/10 text-destructive', border: 'border' },
  success: { bg: 'bg-card', icon: 'bg-success/10 text-success', border: 'border' },
  info: { bg: 'bg-card', icon: 'bg-info/10 text-info', border: 'border' },
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, variant = 'default' }) => {
  const style = variantStyles[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${style.bg} ${style.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1.5">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${style.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
