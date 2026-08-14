import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const toastStyles = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    text: 'text-emerald-800',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    text: 'text-red-800',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: Info,
    iconColor: 'text-primary',
    text: 'text-blue-800',
  },
};

function ToastItem({ toast, onDismiss }) {
  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md min-w-[280px] max-w-sm animate-fade-in ${style.bg}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.iconColor}`} />
      <div className="flex-1">
        {toast.title && <p className={`font-bold text-sm ${style.text}`}>{toast.title}</p>}
        <p className={`text-sm ${style.text} ${toast.title ? 'opacity-80' : 'font-medium'}`}>{toast.message}</p>
      </div>
      <button onClick={() => onDismiss(toast.id)} className={`${style.iconColor} opacity-60 hover:opacity-100 transition-opacity`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, { type = 'info', title, duration } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, title, duration }]);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
