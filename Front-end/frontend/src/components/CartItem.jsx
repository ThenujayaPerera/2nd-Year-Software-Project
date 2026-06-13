export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="card flex gap-4 items-start">
      {/* Product Image */}
      <img
        src={item.image || 'https://via.placeholder.com/100x100?text=Product'}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />

      {/* Product Details */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{item.brand || 'Generic'}</p>
        <p className="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
        <p className="text-xs text-gray-500">Unit: ${item.price.toFixed(2)}</p>
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-2 border rounded-lg">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
        >
          −
        </button>
        <span className="px-3 py-1 font-medium">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-600 hover:text-red-800 font-medium text-sm"
      >
        Remove
      </button>
    </div>
  );
}
