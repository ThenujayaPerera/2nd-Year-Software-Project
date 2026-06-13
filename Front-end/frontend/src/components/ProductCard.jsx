export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  return (
    <div className="card group overflow-hidden">
      {/* Image Container */}
      <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden h-48">
        <img
          src={product.image || 'https://via.placeholder.com/250x200?text=Product'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110"
        />
        
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
            -{product.discount}%
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
            New
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {/* Category Badge */}
        <div className="mb-2">
          <span className="badge-primary text-xs">
            {product.category || 'Accessories'}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Brand */}
        <p className="text-sm text-gray-600 mb-2">
          {product.brand || 'Generic'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.rating || 4) ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">
              ${product.price || '0.00'}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="badge-success text-xs">In Stock</span>
          ) : (
            <span className="badge-danger text-xs">Out of Stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product.id)}
            className="flex-1 btn-secondary text-sm"
          >
            View
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  );
}
