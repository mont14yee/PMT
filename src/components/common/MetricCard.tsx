import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'blue';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  trendText,
  icon,
  variant = 'default',
  onClick,
}) => {
  const borderStyles = {
    default: 'border-[#273244] hover:border-slate-600',
    critical: 'border-rose-900/60 bg-rose-950/10',
    warning: 'border-amber-900/60 bg-amber-950/10',
    success: 'border-emerald-900/60 bg-emerald-950/10',
    blue: 'border-blue-900/60 bg-blue-950/10',
  };

  const textStyles = {
    default: 'text-[#F8FAFC]',
    critical: 'text-rose-400',
    warning: 'text-amber-400',
    success: 'text-emerald-400',
    blue: 'text-blue-400',
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 bg-[#111722] transition-colors ${borderStyles[variant]} ${
        onClick ? 'cursor-pointer hover:bg-[#192231]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs text-[#94A3B8] font-medium tracking-wide block truncate">
          {label}
        </span>
        {icon && <span className="text-[#94A3B8] shrink-0">{icon}</span>}
      </div>

      <div className="flex flex-col">
        <span className={`text-lg sm:text-xl font-bold font-mono tabular-nums leading-tight ${textStyles[variant]}`}>
          {value}
        </span>
        {subValue && (
          <span className="text-[11px] text-[#94A3B8] font-mono tabular-nums mt-0.5 truncate">
            {subValue}
          </span>
        )}
      </div>

      {trendText && (
        <div className="mt-2 text-[11px] text-[#94A3B8] flex items-center gap-1">
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
};
