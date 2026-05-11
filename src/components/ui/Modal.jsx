import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian-900/60 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          'relative bg-white w-full flex flex-col max-h-[92vh] animate-slide-up',
          'rounded-t-3xl sm:rounded-2xl shadow-modal',
          'border border-[#E8E2D9]',
          sizes[size] ?? sizes.md,
        ].join(' ')}
      >
        {/* Gold accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 rounded-t-2xl shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D9] shrink-0">
          <h2 id={titleId} className="font-display text-base font-bold text-obsidian-900 tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F4F1EB] text-obsidian-400 hover:text-obsidian-700 transition-colors border border-transparent hover:border-[#E8E2D9]"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1 scrollbar-none font-sans">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#E8E2D9] bg-[#FAF8F4] rounded-b-2xl shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
