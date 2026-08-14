export default function Modal({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-slate-700 dark:text-slate-300">
          {children}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <button onClick={onClose} className="flex-1 btn-secondary">
            {cancelText}
          </button>
          {onConfirm && (
            <button onClick={onConfirm} className="flex-1 btn-primary">
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
