import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

// modal
export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {

  // use effect for overflow
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // use effect for escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // if not open, return null
  if (!isOpen) return null;

  // return modal
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        className={`bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl
          flex flex-col w-full max-h-[calc(100vh-48px)] overflow-hidden animate-scale-in
          ${sizeMap[size] || sizeMap.md}
          rounded-2xl`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-dark-border">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
