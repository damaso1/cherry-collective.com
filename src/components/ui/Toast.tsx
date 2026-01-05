import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 5000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Helper functions
export const toast = {
  success: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'success', message, title }),
  error: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'error', message, title }),
  info: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'info', message, title }),
  warning: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'warning', message, title }),
};

const typeConfig: Record<ToastType, {
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  border: string;
  iconColor: string;
}> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-stem-DEFAULT/10',
    border: 'border-stem-DEFAULT/30',
    iconColor: 'text-stem-light',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-cherry-ripe/10',
    border: 'border-cherry-ripe/30',
    iconColor: 'text-cherry-light',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm
        ${config.bg} ${config.border}
        shadow-lg min-w-[300px] max-w-[400px]
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-white mb-0.5">{toast.title}</p>
        )}
        <p className="text-sm text-white/80">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 text-white/60" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onRemove={() => removeToast(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
