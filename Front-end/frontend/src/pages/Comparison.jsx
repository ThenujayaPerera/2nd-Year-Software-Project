import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, ShoppingCart, ArrowLeft, Star, Shield, 
  Sparkles, Bot, Trophy, CheckCircle2, AlertCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import { useComparisonStore, useCartStore } from '../store';

export default function Comparison() {
  const { comparison, removeFromComparison, clearComparison } = useComparisonStore();
  const { addToCart } = useCartStore();

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  // Helper to generate AI comparison analysis
  const handleGenerateAiComparison = async () => {
    if (comparison.length < 2) return;
    setAiAnalyzing(true);
    setAiReport(null);

    try {
      // Attempt backend AI comparison endpoint first
      const res = await fetch('http://localhost:8080/api/products/ai-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId1: comparison[0].id,
          productId2: comparison[1].id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data.aiReport);
      } else {
        // Dynamic client-side AI analysis engine fallback
        generateClientAiReport();
      }
    } catch (err) {
      console.warn('Backend AI endpoint offline, using client-side AI engine:', err);
      generateClientAiReport();
    } finally {
      setAiAnalyzing(false);
    }
  };

  const generateClientAiReport = () => {
    const p1 = comparison[0];
    const p2 = comparison[1];

    const p1PriceRatio = (p1.rating * 1000) / (p1.price || 1);
    const p2PriceRatio = (p2.rating * 1000) / (p2.price || 1);

    const winner = p1PriceRatio >= p2PriceRatio ? p1 : p2;
    const priceDiff = Math.abs(p1.price - p2.price);
    const priceDiffPercent = Math.round((priceDiff / Math.min(p1.price, p2.price)) * 100);

    setAiReport({
      winnerId: winner.id,
      winnerName: winner.name,
      verdictTitle: `🏆 AI Recommended Winner: ${winner.name}`,
      verdictSummary: `${winner.name} delivers a superior balance of technical performance, customer satisfaction rating (${winner.rating}★), and long-term reliability. It offers ${priceDiffPercent > 0 ? `${priceDiffPercent}% better price-to-performance value` : 'outstanding build quality'}.`,
      bestForP1: p1.price > p2.price 
        ? "Power users demanding high-end performance, premium build, and maximum warranty." 
        : "Budget-conscious buyers looking for optimal price-to-performance value.",
      bestForP2: p2.price > p1.price 
        ? "Power users demanding high-end performance, premium build, and maximum warranty." 
        : "Budget-conscious buyers looking for optimal price-to-performance value.",
      prosP1: [
        `High user satisfaction score of ${p1.rating} out of 5 stars`,
        `Official warranty coverage: ${p1.warranty || 'Available'}`,
        p1.stock > 5 ? 'Stable stock availability at NVSHOP' : 'Popular high-demand item',
      ],
      prosP2: [
        `High user satisfaction score of ${p2.rating} out of 5 stars`,
        `Official warranty coverage: ${p2.warranty || 'Available'}`,
        p2.stock > 5 ? 'Stable stock availability at NVSHOP' : 'Popular high-demand item',
      ],
      buyingAdvice: p1.price !== p2.price
        ? `If you have a strict budget, ${p1.price < p2.price ? p1.name : p2.name} saves you LKR ${priceDiff.toLocaleString()} without sacrificing overall usability. However, if top performance is critical, choose ${p1.price > p2.price ? p1.name : p2.name}.`
        : `Both products are priced identically at LKR ${p1.price.toLocaleString()}. We recommend ${winner.name} based on customer rating and features.`
    });
  };

  if (comparison.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Sparkles className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">No products selected for comparison</h1>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">Add at least 2 items from the shop catalog to unlock AI-powered side-by-side analysis & purchase recommendations.</p>
              <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-blue-500/20">
                <ArrowLeft className="w-5 h-5" />
                Browse Catalog & Compare
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2 font-bold text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Products Catalog
              </Link>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Comparison Matrix</h1>
              <p className="text-slate-500 text-xs mt-1">Comparing {comparison.length} selected item{comparison.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="flex gap-3">
              {comparison.length >= 2 && (
                <button
                  onClick={handleGenerateAiComparison}
                  disabled={aiAnalyzing}
                  className="px-5 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${aiAnalyzing ? 'animate-spin' : ''}`} />
                  {aiAnalyzing ? 'AI is Analyzing...' : 'Generate AI Verdict & Comparison'}
                </button>
              )}
              <button
                onClick={clearComparison}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 px-5 rounded-xl text-xs transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* AI Comparison Analysis Box (Shows when AI Verdict is generated) */}
          {aiReport && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl shadow-lg shadow-purple-500/30">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">AI Deep Comparison Engine</span>
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">{aiReport.verdictTitle}</h2>
                  </div>
                </div>
                <button onClick={() => setAiReport(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                  {aiReport.verdictSummary}
                </p>

                {/* Best For Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border transition-all ${
                    aiReport.winnerId === comparison[0].id 
                      ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-sm">{comparison[0].name}</h4>
                    </div>
                    <p className="text-xs opacity-90"><strong>Best Suited For:</strong> {aiReport.bestForP1}</p>
                  </div>

                  {comparison[1] && (
                    <div className={`p-4 rounded-2xl border transition-all ${
                      aiReport.winnerId === comparison[1].id 
                        ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-sm">{comparison[1].name}</h4>
                      </div>
                      <p className="text-xs opacity-90"><strong>Best Suited For:</strong> {aiReport.bestForP2}</p>
                    </div>
                  )}
                </div>

                {/* Pros & Cons Side-by-Side */}
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Why Choose {comparison[0].name}?
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {aiReport.prosP1.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                          <span className="text-emerald-400 font-bold">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {comparison[1] && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Why Choose {comparison[1].name}?
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {aiReport.prosP2.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                            <span className="text-emerald-400 font-bold">•</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* AI Smart Purchasing Advice */}
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-indigo-300">AI Buying Advice</h5>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiReport.buyingAdvice}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase tracking-wider w-48">Product Specifications</th>
                    {comparison.map((product) => (
                      <th key={product.id} className="px-6 py-4 text-center w-64">
                        <div className="relative h-44 mb-3 bg-slate-50 rounded-2xl p-2 overflow-hidden border border-slate-100 group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => removeFromComparison(product.id)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove Product"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1">{product.name}</h3>
                        <p className="text-xs font-semibold text-slate-400">{product.brand}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Price */}
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-900">Price (LKR)</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl font-black text-blue-600">
                            LKR {product.price?.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-semibold">
                              LKR {product.originalPrice?.toLocaleString()}
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Save {product.discount}%
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">Customer Rating</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-slate-900">{product.rating}</span>
                          <span className="text-slate-400">({product.reviews || 12} reviews)</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-900">Category</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-[11px]">
                          {product.category}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Availability */}
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">Stock Status</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-bold text-[11px] ${
                            product.stock > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Warranty */}
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-blue-600" /> Warranty
                    </td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center font-bold text-slate-700">
                        {product.warranty || '1 Year Official Warranty'}
                      </td>
                    ))}
                  </tr>

                  {/* Description / Summary */}
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">Key Features</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center text-slate-600 line-clamp-3 max-w-xs mx-auto">
                        {product.description || 'High performance tech hardware engineered for reliability.'}
                      </td>
                    ))}
                  </tr>

                  {/* Add to Cart Actions */}
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-900">Action</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-center">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Summary & AI Trigger Footer Banner */}
          {comparison.length >= 2 && !aiReport && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Undecided between these products?</h3>
                  <p className="text-xs text-blue-100">Let our AI comparison engine analyze price, specs, rating, and value to choose the winner for you.</p>
                </div>
              </div>
              <button
                onClick={handleGenerateAiComparison}
                disabled={aiAnalyzing}
                className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-black text-xs rounded-xl transition-all shadow-md shrink-0"
              >
                {aiAnalyzing ? 'Analyzing...' : 'Generate AI Comparison'}
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
