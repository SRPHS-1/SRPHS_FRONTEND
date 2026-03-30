import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Types 
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

//  Global event bus para emitir toasts desde cualquier parte de la app sin prop drilling
type ToastListener = (toast: Toast) => void;
const listeners: ToastListener[] = [];

export const toast = {
  success: (message: string, duration = 3500) =>
    emit({ id: uid(), type: 'success', message, duration }),
  error: (message: string, duration = 4500) =>
    emit({ id: uid(), type: 'error', message, duration }),
  warning: (message: string, duration = 4000) =>
    emit({ id: uid(), type: 'warning', message, duration }),
  info: (message: string, duration = 3500) =>
    emit({ id: uid(), type: 'info', message, duration }),
};

function uid() {
  return Math.random().toString(36).slice(2);
}

function emit(t: Toast) {
  listeners.forEach(fn => fn(t));
}

// ToastContainer se monta una vez en el root de la app y escucha nuevos toasts para mostrarlos
export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler: ToastListener = (t) => {
      setToasts(prev => [...prev.slice(-4), t]); // max 5 visible
      setTimeout(() => remove(t.id), t.duration ?? 3500);
    };
    listeners.push(handler);
    return () => {
      const i = listeners.indexOf(handler);
      if (i > -1) listeners.splice(i, 1);
    };
  }, [remove]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={18} />,
    error:   <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info:    <Info size={18} />,
  };

  const styles: Record<ToastType, string> = {
    success: 'bg-[#2D5A27] text-white border-green-400/30',
    error:   'bg-red-600 text-white border-red-400/30',
    warning: 'bg-amber-500 text-white border-amber-300/30',
    info:    'bg-gray-800 text-white border-gray-600/30',
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl
            border shadow-2xl min-w-[280px] max-w-[380px]
            animate-in slide-in-from-right-4 fade-in duration-300
            ${styles[t.type]}
          `}
        >
          <span className="flex-shrink-0 opacity-90">{icons[t.type]}</span>
          <p className="text-sm font-semibold flex-1 leading-snug">{t.message}</p>
          <button
            onClick={() => remove(t.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};