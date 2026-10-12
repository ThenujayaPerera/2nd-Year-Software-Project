export default function Alert({ type = 'info', message, onClose }) {
  const colors = {
    success: 'bg-green-100 dark:bg-emerald-950/60 text-green-800 dark:text-emerald-300 border-green-300 dark:border-emerald-800/80',
    error: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800/80',
    info: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800/80',
    warning: 'bg-yellow-100 dark:bg-amber-950/60 text-yellow-800 dark:text-amber-300 border-yellow-300 dark:border-amber-800/80',
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
