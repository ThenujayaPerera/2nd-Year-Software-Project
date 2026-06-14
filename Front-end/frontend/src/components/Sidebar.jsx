import { useFilterStore } from '../store';
import { SlidersHorizontal, Layers, DollarSign, Award, CheckSquare, Square, Star } from 'lucide-react';

export default function Sidebar() {
  const {
    filters,
    setCategory,
    setPriceRange,
    setBrand,
    setInStock,
    setRating,
    resetFilters,
  } = useFilterStore();

  const categories = [
    'Cases',
    'Chargers',
    'Cables',
    'Protection',
    'Wireless',
  ];

  const brands = [
    'Apple',
    'Samsung',
    'Anker',
    'Spigen',
    'NV-Premium',
    'PowerFlow',
    'ArmorShield',
    'NV-Tech',
  ];

  return (
    <aside className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 h-fit sticky top-28">
      <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-slate-800" />
          <h3 className="text-md font-bold text-slate-900">Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          <Layers className="w-3.5 h-3.5" /> Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(isSelected ? '' : cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8 pb-6 border-b border-slate-100">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          <DollarSign className="w-3.5 h-3.5" /> Price Range
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="25000"
            step="500"
            value={filters.priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>LKR 0</span>
            <span>LKR {filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="mb-8 pb-6 border-b border-slate-100">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          <Award className="w-3.5 h-3.5" /> Brand
        </h4>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {brands.map((brand) => {
            const isChecked = filters.brand === brand;
            return (
              <button
                key={brand}
                onClick={() => setBrand(isChecked ? '' : brand)}
                className="flex items-center gap-3 w-full text-left group"
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-blue-600 fill-blue-50" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                )}
                <span className={`text-sm font-medium ${isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {brand}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="mb-8 pb-6 border-b border-slate-100">
        <button
          onClick={() => setInStock(!filters.inStock)}
          className="flex items-center gap-3 w-full text-left group"
        >
          {filters.inStock ? (
            <CheckSquare className="w-5 h-5 text-blue-600 fill-blue-50" />
          ) : (
            <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
          )}
          <span className={`text-sm font-semibold ${filters.inStock ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
            In Stock Only
          </span>
        </button>
      </div>

      {/* Rating */}
      <div>
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          <Star className="w-3.5 h-3.5" /> Minimum Rating
        </h4>
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const isSelected = filters.rating === rating;
            return (
              <button
                key={rating}
                onClick={() => setRating(isSelected ? 0 : rating)}
                className="flex items-center gap-3 w-full text-left group"
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-slate-400'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  {rating < 5 && <span className="text-xs text-slate-400 font-medium ml-1">& Up</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

