import React from 'react';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#111722] border border-[#273244] rounded-xl p-6 text-[#F8FAFC] shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              isDestructive ? 'bg-rose-950/60 text-rose-400' : 'bg-blue-950/60 text-blue-400'
            }`}
          >
            {isDestructive ? <ShieldAlert className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#273244]">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#192231] rounded-lg transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
