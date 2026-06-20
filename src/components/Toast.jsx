import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

/**
 * Toast notification for success, error, warning, or informational messages.
 */
export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-300',
    error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800/30 dark:text-rose-300',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/30 dark:text-amber-300',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800/30 dark:text-blue-300'
  };

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 p-4 border rounded-xl shadow-lg transition-all duration-300 transform scale-100 z-50 max-w-md ${colors[type]}`}>
      {icons[type]}
      <div className="text-sm font-medium pr-2">{message}</div>
      <button 
        onClick={onClose} 
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ml-auto"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
}
