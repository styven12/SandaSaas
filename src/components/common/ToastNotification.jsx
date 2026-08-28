import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastNotification({ type = 'info', message, visible = true }) {
  if (!visible || !message) return null;

  const styles = {
    success: 'border-green-200 bg-green-50 text-green-700',
    error: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-blue-200 bg-blue-50 text-blue-700',
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type] || Info;

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles[type]}`}>
      <Icon size={18} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}
