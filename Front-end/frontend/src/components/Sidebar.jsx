import { useFilterStore } from '../store';

export default function Sidebar() {
  const {
    filters,
    setCategory,
    setPriceRange,
    setBrand,
    setInStock,
    resetFilters,
  } = useFilterStore();

  const categories = [
    'Screen Protectors',
    'Phone Cases',
    'Chargers',
    'Cables',
    'Tempered Glass',
    'Power Banks',
    'Wireless Chargers',
    'Stands',
  ];

  const brands = [
    'Apple',
    'Samsung',
    'OnePlus',
    'Xiaomi',
    'Generic',
    'OtterBox',
    'Spigen',
  ];

  return (
    <aside className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-gray-700">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === cat}
                onChange={(e) => setCategory(e.target.checked ? cat : '')}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b">
        <h4 className="font-semibold mb-3 text-gray-700">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100000"
            value={filters.priceRange[1]}
            onChange={(e) => setPriceRange([filters.priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6 pb-6 border-b">
        <h4 className="font-semibold mb-3 text-gray-700">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={(e) => setBrand(e.target.checked ? brand : '')}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-700">Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => setInStock(rating)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-yellow-400">
                {'⭐'.repeat(rating)}
              </span>
              <span className="text-sm text-gray-600">&up</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
