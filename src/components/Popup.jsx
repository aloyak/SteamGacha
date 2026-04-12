import { createPortal } from 'react-dom';

export default function CursorPopup({ open = false, x = 0, y = 0, children, className = '' }) {
  if (!open) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={`fixed z-50 pointer-events-none rounded-lg border border-white/10 bg-[#0b1020]/95 px-3 py-2 text-xs text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md ${className}`}
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      {children}
    </div>
    ,
    document.body
  );
}