import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'sm',
  icon,
}) => {
  const variantStyles = {
    success: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
    warning: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
    critical: 'text-rose-400 bg-rose-950/40 border-rose-800/50',
    info: 'text-blue-400 bg-blue-950/40 border-blue-800/50',
    neutral: 'text-slate-400 bg-slate-900 border-slate-700/60',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded font-mono ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
