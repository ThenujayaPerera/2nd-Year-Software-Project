import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useComparisonStore } from '../store';

export default function ComparisonFloatingButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { comparison, removeFromComparison, clearComparison } = useComparisonStore();

  // Don't show on comparison page or when comparison is empty
  if (location.pathname === '/comparison' || comparison.length === 0) {
    return null;
  }

  const isMaxReached = comparison.length >= 3;

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-28 sm:right-6 z-40 flex flex-col gap-2 w-[270px] sm:w-[320px] animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Comparison Matrix Notification Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden backdrop-blur-sm">
        
        {/* Header Bar with Action & Cross Mark to Dismiss/Remove */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-3 sm:p-3.5 flex items-center justify-between gap-2 shadow-sm">
          <button
            onClick={() => navigate('/comparison')}
            className="flex items-center gap-2.5 min-w-0 text-left group flex-1"
            title="Open Product Comparison Matrix"
          >
            <div className="p-1.5 bg-white/15 group-hover:bg-white/25 rounded-xl transition-colors shrink-0">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm leading-tight text-white group-hover:text-blue-100 transition-colors">
                  Compare Matrix
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                  isMaxReached 
                    ? 'bg-amber-400/20 text-amber-200 border-amber-300/30' 
                    : 'bg-white/15 text-blue-100 border-white/20'
                }`}>
                  {comparison.length}/3
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-blue-100/90 truncate">
                {isMaxReached ? 'Max limit reached (3 items)' : 'Compare up to 3 items'}
              </span>
            </div>
          </button>

          {/* Cross Mark to Remove / Dismiss the Notification */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearComparison();
            }}
            className="p-1.5 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white rounded-xl transition-all shrink-0"
            title="Remove comparison matrix"
            aria-label="Remove comparison notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Product Pills (Compact & Clean on all screen sizes) */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 space-y-1.5 max-h-44 overflow-y-auto">
          {comparison.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-100 text-xs shadow-2xs group hover:border-blue-200 hover:bg-blue-50/40 transition-all"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-0.5 border border-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate text-[11px] leading-tight">
                  {product.name}
                </p>
                <p className="text-[10px] text-blue-600 font-semibold">
                  Rs. {product.price?.toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromComparison(product.id);
                }}
                className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                title={`Remove ${product.name}`}
                aria-label={`Remove ${product.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-500 font-medium px-1">
            {isMaxReached ? 'Max 3 items selected' : `Add ${3 - comparison.length} more (max 3)`}
          </span>
          <button
            onClick={() => navigate('/comparison')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
