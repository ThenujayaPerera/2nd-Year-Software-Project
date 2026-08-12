export default function Alert({ type = 'info', message, onClose }) {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 flex items-center justify-between ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{icons[type]}</span>
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 font-bold opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
