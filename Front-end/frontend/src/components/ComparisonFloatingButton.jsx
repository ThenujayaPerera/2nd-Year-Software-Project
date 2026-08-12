import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, X } from 'lucide-react';
import { useComparisonStore } from '../store';

export default function ComparisonFloatingButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { comparison, removeFromComparison, clearComparison } = useComparisonStore();

  // Don't show on comparison page
  if (location.pathname === '/comparison' || comparison.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-28 right-6 z-40 flex flex-col gap-3">
      {/* Comparison Badge */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => navigate('/comparison')}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center gap-3 transition-all"
        >
          <Scale className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm">Compare</span>
            <span className="text-xs opacity-90">{comparison.length} items selected</span>
          </div>
        </button>
        
        {/* Product Pills */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 max-h-40 overflow-y-auto">
          {comparison.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 p-2 bg-white rounded-lg mb-2 text-xs last:mb-0 group hover:bg-blue-50 transition-all"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-8 h-8 rounded object-cover"
              />
              <span className="flex-1 font-semibold text-slate-700 line-clamp-1">
                {product.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromComparison(product.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-slate-500 text-center px-2">
        Click to view comparison
      </p>
    </div>
  );
}
