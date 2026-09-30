export default function Modal({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
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
