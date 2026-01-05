import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { CherryButton } from './CherryButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  footer,
  className = '',
}: ModalProps) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            className={`
              relative w-full ${sizeStyles[size]}
              bg-bark-dark border border-cherry-ripe/30
              rounded-xl shadow-cherry-lg overflow-hidden
              ${className}
            `}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-cherry-ripe/5 to-transparent pointer-events-none" />

            {/* Header */}
            {(title || showClose) && (
              <div className="relative flex items-center justify-between px-6 py-4 border-b border-cherry-ripe/20">
                {title && (
                  <h2 className="text-xl font-display font-semibold text-white">
                    {title}
                  </h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-cherry-ripe/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60 hover:text-white" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="relative px-6 py-5 max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="relative flex items-center justify-end gap-3 px-6 py-4 border-t border-cherry-ripe/20 bg-bark-medium/50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Confirm Dialog
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <CherryButton variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </CherryButton>
          <CherryButton
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </CherryButton>
        </>
      }
    >
      <p className="text-white/80">{message}</p>
    </Modal>
  );
};

export default Modal;
