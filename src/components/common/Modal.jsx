import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div 
        className={`relative w-full ${maxWidth} bg-[#111111] rounded-2xl border border-[#252525] shadow-2xl overflow-hidden z-10 my-8 transition-all animate-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#252525] bg-[#151515]">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-400 mt-1 font-normal">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[80vh] overflow-y-auto text-zinc-200">
          {children}
        </div>
      </div>
    </div>
  );
}
