import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, ShoppingCart, ArrowLeft, Star, Shield, 
  Sparkles, CheckCircle2, AlertCircle, Scale,
  Layers, Info
} from 'lucide-react';
import Layout from '../components/Layout';
import { useComparisonStore, useCartStore } from '../store';
import { comparisonAPI } from '../services/api';

// Helper to extract cleanly structured key feature bullet points from product description
const extractProductFeatures = (product) => {
  if (!product) return [];
  if (Array.isArray(product.features) && product.features.length > 0) {
    return product.features;
  }
  const desc = product.description || '';
  if (!desc) return ['Authentic genuine product with official manufacturer warranty.'];

  // Check if there is a "Key Features:" block
  if (desc.toLowerCase().includes('key features:')) {
    const parts = desc.split(/key features:/i);
    const featuresBlock = parts[1] || '';
    const lines = featuresBlock
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }

  // Fallback: look for any bulleted lines in the entire description
  const bulletLines = desc
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
  if (bulletLines.length > 0) return bulletLines;

  // Fallback: split by sentences and take first 3-4 sentences
  const sentences = desc
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 130);
  if (sentences.length > 0) return sentences.slice(0, 4);

  return ['Authentic genuine product with official manufacturer warranty.'];
};

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
      // Call backend AI comparison endpoint (Groq LLM + Store DB) with all product IDs (2 or 3)
      const ids = comparison.map(p => p.id);
      const res = await comparisonAPI.compareWithAi(ids);
      if (res.data?.aiReport) {
        setAiReport(res.data.aiReport);
      } else {
        generateClientAiReport();
      }
    } catch (err) {
      console.warn('Backend AI comparison endpoint offline, using client-side fallback:', err);
      generateClientAiReport();
    } finally {
      setAiAnalyzing(false);
    }
  };

  const generateClientAiReport = () => {
    const p1 = comparison[0];
    const p2 = comparison[1];
    const p3 = comparison[2] || null;

    const categories = comparison.map(p => (p.category || '').toLowerCase());
    const isMismatched = categories.some(c => c.includes('case')) &&
                         categories.some(c => c.includes('watch') || c.includes('audio') || c.includes('power') || c.includes('phone'));

    if (isMismatched) {
      setAiReport({
        isMismatchedCategory: true,
        mismatchedExplanation: `Comparing products across fundamentally distinct functional categories is an apples-to-oranges comparison. They fulfill different roles in your tech ecosystem and are typically paired together rather than competing directly.`,
        comparisonTitle: `Complementary Category Analysis: ${comparison.map(p => p.name).join(' vs ')}`,
        comparisonSummary: "These products fulfill fundamentally different roles in your tech setup and complement rather than replace each other.",
        keyDifferences: [
          {
            feature: "Primary Function",
            product1: p1.category || "Main Hardware",
            product2: p2.category || "Accessory",
            ...(p3 ? { product3: p3.category || "Accessory" } : {})
          },
          {
            feature: "Price (LKR)",
            product1: `Rs. ${p1.price?.toLocaleString()}`,
            product2: `Rs. ${p2.price?.toLocaleString()}`,
            ...(p3 ? { product3: `Rs. ${p3.price?.toLocaleString()}` } : {})
          },
          {
            feature: "Warranty",
            product1: p1.warranty || "Standard",
            product2: p2.warranty || "Standard",
            ...(p3 ? { product3: p3.warranty || "Standard" } : {})
          }
        ],
        strengthsP1: [
          `Primary device function with official ${p1.warranty || 'warranty'}`,
          `Rated ${p1.rating || 4.5} out of 5 stars by verified buyers`
        ],
        strengthsP2: [
          `Specialized protective or complementary companion for your setup`,
          `High durability rating of ${p2.rating || 4.5} out of 5 stars`
        ],
        ...(p3 ? {
          strengthsP3: [
            `Complementary accessory or device with official ${p3.warranty || 'warranty'}`,
            `Customer rating of ${p3.rating || 4.5} out of 5 stars`
          ],
          bestForP3: `Buyers looking for ${p3.category || 'this'} hardware.`
        } : {}),
        bestForP1: `Buyers looking for ${p1.category || 'this category'} functionality.`,
        bestForP2: `Buyers needing ${p2.category || 'accessory'} protection or enhancement.`,
        buyingAdvice: "These items do not directly compete. Evaluate each product according to its intended purpose in your setup."
      });
      return;
    }

    setAiReport({
      isMismatchedCategory: false,
      mismatchedExplanation: "",
      comparisonTitle: `Balanced Technical Analysis: ${comparison.map(p => p.name).join(' vs ')}`,
      comparisonSummary: `A neutral technical breakdown comparing specifications, price points, and official warranty terms for all ${comparison.length} models. All products are 100% genuine with local company warranty at NVSHOP.LK.`,
      keyDifferences: [
        {
          feature: "Price (LKR)",
          product1: `Rs. ${p1.price?.toLocaleString()}`,
          product2: `Rs. ${p2.price?.toLocaleString()}`,
          ...(p3 ? { product3: `Rs. ${p3.price?.toLocaleString()}` } : {})
        },
        {
          feature: "Official Warranty",
          product1: p1.warranty || "Company Warranty",
          product2: p2.warranty || "Company Warranty",
          ...(p3 ? { product3: p3.warranty || "Company Warranty" } : {})
        },
        {
          feature: "Customer Rating",
          product1: `${p1.rating || 4.5} / 5.0 Stars`,
          product2: `${p2.rating || 4.5} / 5.0 Stars`,
          ...(p3 ? { product3: `${p3.rating || 4.5} / 5.0 Stars` } : {})
        },
        {
          feature: "Stock Availability",
          product1: p1.stock > 0 ? `${p1.stock} units in stock` : "Out of stock",
          product2: p2.stock > 0 ? `${p2.stock} units in stock` : "Out of stock",
          ...(p3 ? { product3: p3.stock > 0 ? `${p3.stock} units in stock` : "Out of stock" } : {})
        }
      ],
      strengthsP1: [
        `Priced at Rs. ${p1.price?.toLocaleString()}`,
        `Official company warranty: ${p1.warranty || 'Available'}`,
        `Customer satisfaction rating of ${p1.rating || 4.5} stars`
      ],
      strengthsP2: [
        `Priced at Rs. ${p2.price?.toLocaleString()}`,
        `Official company warranty: ${p2.warranty || 'Available'}`,
        `Customer satisfaction rating of ${p2.rating || 4.5} stars`
      ],
      ...(p3 ? {
        strengthsP3: [
          `Priced at Rs. ${p3.price?.toLocaleString()}`,
          `Official company warranty: ${p3.warranty || 'Available'}`,
          `Customer satisfaction rating of ${p3.rating || 4.5} stars`
        ],
        bestForP3: `Buyers prioritizing ${p3.name} with verified official warranty.`
      } : {}),
      bestForP1: `Buyers prioritizing ${p1.name} with verified official warranty.`,
      bestForP2: `Buyers prioritizing ${p2.name} with verified official warranty.`,
      buyingAdvice: `All ${comparison.length} models are 100% genuine with official warranties at NVSHOP.LK. Choose according to your budget preferences and specific brand features.`
    });
  };

  if (comparison.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 sm:py-12 px-3 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-12 text-center border border-slate-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-blue-600">
                <Scale className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 sm:mb-4">No products selected for comparison</h1>
              <p className="text-slate-600 text-xs sm:text-sm mb-6 sm:mb-8 max-w-md mx-auto">Add at least 2 items from the shop catalog to unlock AI-powered side-by-side analysis and technical evaluation.</p>
              <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl transition-all shadow-md shadow-blue-500/20 text-xs sm:text-sm">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 sm:py-12 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-1.5 font-bold text-xs sm:text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Products Catalog
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Product Comparison Matrix</h1>
              <p className="text-slate-500 text-xs mt-0.5">Comparing {comparison.length} of 3 selected items (Max 3 items)</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {comparison.length >= 2 && (
                <button
                  onClick={handleGenerateAiComparison}
                  disabled={aiAnalyzing}
                  className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Scale className={`w-4 h-4 ${aiAnalyzing ? 'animate-spin' : ''}`} />
                  {aiAnalyzing ? 'Analyzing with AI...' : 'Compare with AI'}
                </button>
              )}
              <button
                onClick={clearComparison}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl text-xs transition-colors shrink-0"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* AI Comparison Analysis Box (Cohesive NVSHOP Theme, Zero Emojis) */}
          {aiReport && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xl border border-slate-200/90 animate-in fade-in zoom-in-95 duration-300 space-y-6">
              
              {/* Box Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-xs">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        AI Technical Comparison Engine
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">• Impartial & Unbiased</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1">
                      {aiReport.comparisonTitle || aiReport.verdictTitle || `Side-by-Side: ${comparison[0].name} vs ${comparison[1].name}`}
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={() => setAiReport(null)} 
                  className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Close Analysis"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mismatched / Incompatible Category Advisory (e.g. Phone vs Phone Case) */}
              {aiReport.isMismatchedCategory && (
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 text-amber-950 flex items-start gap-3.5">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-amber-900">
                      Category Notice: Complementary Products Rather Than Direct Competitors
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
                      {aiReport.mismatchedExplanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Executive Summary */}
              {aiReport.comparisonSummary && (
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {aiReport.comparisonSummary}
                  </p>
                </div>
              )}

              {/* Key Technical Differences Table */}
              {aiReport.keyDifferences && aiReport.keyDifferences.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-blue-600" />
                    Key Hardware & Technical Differences
                  </h4>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                          <th className={`px-4 py-3 text-left font-bold ${comparison.length >= 3 ? 'w-1/4' : 'w-1/3'}`}>Technical Dimension</th>
                          <th className={`px-4 py-3 text-left font-bold text-blue-700 ${comparison.length >= 3 ? 'w-1/4' : 'w-1/3'}`}>{comparison[0].name}</th>
                          <th className={`px-4 py-3 text-left font-bold text-indigo-700 ${comparison.length >= 3 ? 'w-1/4' : 'w-1/3'}`}>{comparison[1]?.name}</th>
                          {comparison[2] && (
                            <th className="px-4 py-3 text-left font-bold w-1/4 text-emerald-700">{comparison[2].name}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {aiReport.keyDifferences.map((diff, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="px-4 py-3 font-semibold text-slate-900">{diff.feature}</td>
                            <td className="px-4 py-3 text-slate-700 font-medium">{diff.product1}</td>
                            <td className="px-4 py-3 text-slate-700 font-medium">{diff.product2}</td>
                            {comparison[2] && (
                              <td className="px-4 py-3 text-slate-700 font-medium">{diff.product3 || '-'}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Strengths Side-by-Side (Unbiased) */}
              <div className={`grid gap-4 sm:gap-6 ${comparison.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-100/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-sm text-blue-900">{comparison[0].name}</h5>
                    <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-100">
                      Rs. {comparison[0].price?.toLocaleString()}
                    </span>
                  </div>
                  {aiReport.bestForP1 && (
                    <p className="text-xs text-blue-950 font-medium bg-white/70 p-2.5 rounded-xl border border-blue-100/70">
                      <strong>Best Suited For:</strong> {aiReport.bestForP1}
                    </p>
                  )}
                  {aiReport.strengthsP1 && aiReport.strengthsP1.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {aiReport.strengthsP1.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {comparison[1] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-sm text-indigo-900">{comparison[1].name}</h5>
                      <span className="text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-100">
                        Rs. {comparison[1].price?.toLocaleString()}
                      </span>
                    </div>
                    {aiReport.bestForP2 && (
                      <p className="text-xs text-indigo-950 font-medium bg-white/70 p-2.5 rounded-xl border border-indigo-100/70">
                        <strong>Best Suited For:</strong> {aiReport.bestForP2}
                      </p>
                    )}
                    {aiReport.strengthsP2 && aiReport.strengthsP2.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {aiReport.strengthsP2.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {comparison[2] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-sm text-emerald-900">{comparison[2].name}</h5>
                      <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-100">
                        Rs. {comparison[2].price?.toLocaleString()}
                      </span>
                    </div>
                    {aiReport.bestForP3 && (
                      <p className="text-xs text-emerald-950 font-medium bg-white/70 p-2.5 rounded-xl border border-emerald-100/70">
                        <strong>Best Suited For:</strong> {aiReport.bestForP3}
                      </p>
                    )}
                    {aiReport.strengthsP3 && aiReport.strengthsP3.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {aiReport.strengthsP3.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Objective Purchasing Advice */}
              {aiReport.buyingAdvice && (
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Technical Recommendation & Purchasing Advice
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed font-medium">
                      {aiReport.buyingAdvice}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            {/* Mobile Scroll Hint */}
            <div className="sm:hidden px-4 py-2.5 bg-blue-50/70 border-b border-blue-100/60 flex items-center justify-between text-[11px] font-bold text-blue-800">
              <span>Swipe sideways to view full comparison →</span>
              <span className="text-blue-500 font-semibold">{comparison.length}/3 products</span>
            </div>
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-black text-slate-900 uppercase tracking-wider min-w-[130px] sm:w-48 sticky left-0 bg-slate-50 z-10 shadow-sm sm:shadow-none">Product Specs</th>
                    {comparison.map((product) => (
                      <th key={product.id} className="px-4 sm:px-6 py-4 text-center min-w-[200px] sm:w-64">
                        <div className="relative h-36 sm:h-44 mb-3 bg-slate-50 rounded-2xl p-2 overflow-hidden border border-slate-100 group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => removeFromComparison(product.id)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                            title="Remove Product"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mb-1">{product.name}</h3>
                        <p className="text-[11px] sm:text-xs font-semibold text-slate-400">{product.brand}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Price */}
                  <tr>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white z-10 shadow-sm sm:shadow-none">Price (LKR)</td>
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
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 sticky left-0 bg-slate-50 z-10 shadow-sm sm:shadow-none">Rating</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-4 sm:px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-slate-900">{product.rating}</span>
                          <span className="text-slate-400 text-[11px]">({product.reviews || 12})</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white z-10 shadow-sm sm:shadow-none">Category</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-4 sm:px-6 py-4 text-center">
                        <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold text-[11px]">
                          {product.category}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Availability */}
                  <tr className="bg-slate-50/50">
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 sticky left-0 bg-slate-50 z-10 shadow-sm sm:shadow-none">Stock Status</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-4 sm:px-6 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            product.stock > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Warranty */}
                  <tr>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white z-10 shadow-sm sm:shadow-none">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Warranty</span>
                      </div>
                    </td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-4 sm:px-6 py-4 text-center font-bold text-slate-700">
                        {product.warranty || '1 Year Official Warranty'}
                      </td>
                    ))}
                  </tr>

                  {/* Key Features */}
                  <tr className="bg-slate-50/50">
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 sticky left-0 bg-slate-50 z-10 shadow-sm sm:shadow-none align-top">
                      Key Features
                    </td>
                    {comparison.map((product) => {
                      const features = extractProductFeatures(product);
                      return (
                        <td key={product.id} className="px-4 sm:px-6 py-4 align-top">
                          <div className="space-y-2 text-left max-w-xs mx-auto">
                            {features.map((feature, idx) => {
                              const separator = feature.includes('–') ? '–' : feature.includes(' - ') ? ' - ' : feature.includes(':') ? ':' : '';
                              let boldPart = '';
                              let restPart = feature;
                              if (separator && feature.indexOf(separator) < 35) {
                                const parts = feature.split(separator);
                                boldPart = parts[0].trim();
                                restPart = parts.slice(1).join(separator).trim();
                              }
                              return (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                                  <span>
                                    {boldPart ? <strong className="text-slate-900 font-semibold">{boldPart}: </strong> : null}
                                    {restPart}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Add to Cart Actions */}
                  <tr>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white z-10 shadow-sm sm:shadow-none">Action</td>
                    {comparison.map((product) => (
                      <td key={product.id} className="px-4 sm:px-6 py-4 text-center">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 sm:py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-xs sm:text-sm"
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

          {/* Quick Summary & AI Trigger Footer Banner (Cohesive NVSHOP Theme) */}
          {comparison.length >= 2 && !aiReport && (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-blue-500/20">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-white/15 rounded-2xl border border-white/20 shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Looking for side-by-side technical clarity?</h3>
                  <p className="text-xs text-blue-100">Our AI comparison engine analyzes hardware specifications, warranty terms, and category suitability with zero bias.</p>
                </div>
              </div>
              <button
                onClick={handleGenerateAiComparison}
                disabled={aiAnalyzing}
                className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-black text-xs rounded-xl transition-all shadow-md shrink-0 active:scale-95 disabled:opacity-50"
              >
                {aiAnalyzing ? 'Analyzing with AI...' : 'Compare with AI'}
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
