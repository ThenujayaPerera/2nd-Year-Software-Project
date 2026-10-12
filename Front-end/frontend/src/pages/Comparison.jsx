import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, ArrowLeft, Star, Shield } from 'lucide-react';
import Layout from '../components/Layout';
import { useComparisonStore } from '../store';
import { useCartStore } from '../store';

export default function Comparison() {
  const { comparison, removeFromComparison, clearComparison } = useComparisonStore();
  const { addToCart } = useCartStore();

  if (comparison.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-12 px-4 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-darkCard rounded-2xl shadow-lg p-12 text-center border border-slate-100 dark:border-darkBorder">
              <div className="w-20 h-20 bg-slate-100 dark:bg-darkNav rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-slate-400 dark:text-darkMuted" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-darkText mb-4">No products to compare</h1>
              <p className="text-slate-600 dark:text-darkMuted mb-8">Add 2-4 products to compare their features and specifications</p>
              <Link to="/products" className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all">
                <ArrowLeft className="inline w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-12 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <Link to="/products" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-semibold">
                <ArrowLeft className="w-5 h-5" />
                Back to Products
              </Link>
              <h1 className="text-4xl font-black text-slate-900 dark:text-darkText">Compare Products</h1>
              <p className="text-slate-600 dark:text-darkMuted mt-2">Comparing {comparison.length} product{comparison.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={clearComparison}
              className="bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-950/60 text-red-700 dark:text-red-300 font-bold py-2 px-6 rounded-lg transition-colors w-fit border border-transparent dark:border-red-900/40"
            >
              Clear All
            </button>
          </div>

          {/* Comparison Table */}
          <div className="bg-white dark:bg-darkCard rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-darkBorder">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-darkNav border-b border-slate-200 dark:border-darkBorder">
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-darkText w-48">Product</th>
                    {comparison.map((product) => (
                      <th key={product.id} className="px-6 py-4 text-center w-56">
                        <div className="relative h-40 mb-2 bg-slate-100 dark:bg-darkBg rounded-lg overflow-hidden group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFromComparison(product.id)}
                            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-darkText text-sm line-clamp-2 mb-1">{product.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-darkMuted">{product.brand}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-slate-200 dark:border-darkBorder">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-darkText">Price</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl font-black text-primary">
                            LKR {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 dark:text-darkMuted line-through">
                              LKR {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                          {product.discount && (
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                              Save {product.discount}%
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-b border-slate-200 dark:border-darkBorder bg-slate-50 dark:bg-darkNav/50">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-darkText">Rating</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-bold text-slate-900 dark:text-darkText">({product.reviews})</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr className="border-b border-slate-200 dark:border-darkBorder">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-darkText">Category</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                          {product.category}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr className="border-b border-slate-200 dark:border-darkBorder bg-slate-50 dark:bg-darkNav/50">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-darkText">Stock Status</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 0
                              ? 'bg-green-100 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-400'
                              : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                    {/* Performance */}
                    <tr className="border-b border-slate-200 dark:border-darkBorder">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-darkText">Performance</td>
                      {comparison.map((product) => {
                        const score = product.performance?.score ?? Math.round(product.rating * 20);
                        const color = score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400';
                        return (
                          <td key={product.id} className="px-6 py-4 text-center">
                            <div className="max-w-xs mx-auto">
                              <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-sm font-bold text-slate-900 dark:text-darkText">{score}</span>
                                <span className="text-xs text-slate-500 dark:text-darkMuted">/100</span>
                              </div>
                              <div className="w-full h-3 bg-slate-100 dark:bg-darkBorder rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${color}`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                  {/* Warranty */}
                  <tr className="border-b border-slate-200 dark:border-darkBorder">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-darkText flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Warranty
                    </td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <span className="inline-block bg-blue-50 dark:bg-darkNav text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-transparent dark:border-darkBorder">
                          {product.warranty || '2 Years'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Add to Cart */}
                  <tr className="bg-slate-50 dark:bg-darkNav/50">
                    <td className="px-6 py-4"></td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-darkCard rounded-xl p-6 border border-slate-100 dark:border-darkBorder">
              <h3 className="font-bold text-lg text-slate-900 dark:text-darkText mb-4">Comparison Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-darkMuted">Highest Price:</span>
                  <span className="font-bold text-slate-900 dark:text-darkText">
                    LKR {Math.max(...comparison.map(p => p.price)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-darkMuted">Lowest Price:</span>
                  <span className="font-bold text-slate-900 dark:text-darkText">
                    LKR {Math.min(...comparison.map(p => p.price)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-darkMuted">Average Rating:</span>
                  <span className="font-bold text-slate-900 dark:text-darkText">
                    {(comparison.reduce((sum, p) => sum + p.rating, 0) / comparison.length).toFixed(1)} ⭐
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-darkMuted">Total Stock:</span>
                  <span className="font-bold text-slate-900 dark:text-darkText">
                    {comparison.reduce((sum, p) => sum + p.stock, 0)} units
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 dark:bg-darkCard rounded-xl p-6 border border-primary/20 dark:border-darkBorder">
              <h3 className="font-bold text-lg text-slate-900 dark:text-darkText mb-4">💡 Recommendation</h3>
              <p className="text-slate-600 dark:text-darkMuted mb-4">
                Based on price-to-rating ratio and stock availability, we recommend:
              </p>
              {(() => {
                const bestValue = comparison.reduce((best, current) => {
                  const bestRatio = best.rating / (best.price / 1000);
                  const currentRatio = current.rating / (current.price / 1000);
                  return currentRatio > bestRatio ? current : best;
                });
                return (
                  <div className="bg-white dark:bg-darkNav rounded-lg p-4 border border-primary/20 dark:border-darkBorder">
                    <p className="font-bold text-primary text-lg">{bestValue.name}</p>
                    <p className="text-sm text-slate-600 dark:text-darkMuted mt-1">Best value for your budget</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
