import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Drawer({ isOpen, onClose, title, subtitle, children, width = 'max-w-xl' }) {
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen ${width} bg-[#111111] border-l border-[#252525] shadow-drawer flex flex-col justify-between transform transition-all ease-in-out duration-300 animate-in slide-in-from-right`}>
          
          {/* Header */}
          <div className="p-6 border-b border-[#252525] bg-[#151515]/70 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
              {subtitle && <p className="text-xs text-zinc-400 mt-1 font-normal">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
