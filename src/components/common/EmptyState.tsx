import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="border border-dashed border-[#273244] bg-[#111722]/50 rounded-xl p-8 sm:p-12 text-center max-w-xl mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-[#192231] text-[#3B82F6] flex items-center justify-center mx-auto mb-4 border border-[#273244]">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-[#F8FAFC]">{title}</h3>
      <p className="text-xs text-[#94A3B8] mt-1.5 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-[#111722] border border-[#273244] rounded-lg" />
      ))}
    </div>
  );
};
