import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, TrendingDown, TrendingUp, PackageOpen, Download, X } from 'lucide-react';

export default function StockManagementTab({ products, onUpdateStock }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Pseudo-random number generator to create stable mock data based on product ID
  const generateHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const enhancedProducts = useMemo(() => {
    return products.map(product => {
      const hash = generateHash(product.id.toString());
      
      // MOCK DATA GENERATION (Stable per product)
      const weeklySales = (hash % 25) + 1; // 1-25
      const returnRate = (hash % 100) / 10; // 0.0 - 9.9%
      const leadTime = (hash % 10) + 7; // 7-16 days
      const safetyStock = Math.ceil(weeklySales * 0.5); // Buffer
      const rop = Math.ceil((weeklySales / 7) * leadTime) + safetyStock;
      const reservedStock = Math.floor(weeklySales * 0.3); // Some stock reserved for pending orders
      
      const physicalStock = product.stock || 0;
      const availableStock = Math.max(0, physicalStock - reservedStock);
      
      const dailySales = weeklySales / 7;
      const runoutDays = dailySales > 0 ? Math.floor(availableStock / dailySales) : 999;
      
      const margin = (hash % 30) + 15; // 15-45%
      const costPrice = product.price * (1 - (margin / 100));
      const inventoryValue = physicalStock * costPrice;
      
      let healthStatus = 'Healthy';
      let healthColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      
      if (physicalStock === 0) {
        healthStatus = 'Out of Stock';
        healthColor = 'text-red-700 bg-red-50 border-red-200';
      } else if (availableStock <= rop) {
        healthStatus = 'Reorder Now';
        healthColor = 'text-amber-700 bg-amber-50 border-amber-200';
      } else if (runoutDays > 90) {
        healthStatus = 'Overstocked';
        healthColor = 'text-blue-700 bg-blue-50 border-blue-200';
      }

      return {
        ...product,
        metrics: {
          weeklySales,
          returnRate,
          leadTime,
          rop,
          reservedStock,
          availableStock,
          physicalStock,
          runoutDays,
          inventoryValue,
          margin,
          costPrice,
          healthStatus,
          healthColor
        }
      };
    });
  }, [products]);

  const filteredProducts = enhancedProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filterStatus === 'OOS') return p.metrics.healthStatus === 'Out of Stock';
    if (filterStatus === 'REORDER') return p.metrics.healthStatus === 'Reorder Now';
    if (filterStatus === 'OVERSTOCKED') return p.metrics.healthStatus === 'Overstocked';
    return true;
  });

  const handleManualRestock = (product) => {
    setStockModalProduct(product);
    setNewStockValue(product.stock?.toString() || '0');
  };

  const submitStockUpdate = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    
    const newStock = parseInt(newStockValue, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid stock number.');
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:8080/api/products/${stockModalProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stockModalProduct, stock: newStock })
      });
      if (res.ok) {
        onUpdateStock();
        setStockModalProduct(null);
      } else {
        alert("Failed to update stock.");
      }
    } catch (e) {
      alert("Server error.");
    } finally {
      setIsUpdating(false);
    }
  };

  const totalValue = enhancedProducts.reduce((sum, p) => sum + p.metrics.inventoryValue, 0);
  const outOfStockCount = enhancedProducts.filter(p => p.metrics.healthStatus === 'Out of Stock').length;
  const reorderCount = enhancedProducts.filter(p => p.metrics.healthStatus === 'Reorder Now').length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Advanced Inventory & Replenishment</h3>
          <p className="text-xs text-slate-500 mt-1">Manage physical stock, velocity, financial impact, and reorder triggers.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Inventory Value</p>
          <div className="text-xl font-black text-slate-900">LKR {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Out of Stock</p>
          <div className="text-xl font-black text-red-900">{outOfStockCount} Items</div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Reorder Required</p>
          <div className="text-xl font-black text-amber-900">{reorderCount} Items</div>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Healthy SKUs</p>
          <div className="text-xl font-black text-emerald-900">
            {enhancedProducts.length - outOfStockCount - reorderCount} Items
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by SKU, Product Name or Brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2 font-bold w-full"
          >
            <option value="ALL">All Statuses</option>
            <option value="OOS">Out of Stock</option>
            <option value="REORDER">Reorder Now</option>
            <option value="OVERSTOCKED">Overstocked</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Product / SKU</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Stock (Avail / Phys)</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Weekly Run-Rate</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Runout Projection</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Reorder Status</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Inventory Value</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {p.id.toString().substring(0,8).toUpperCase()}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 text-sm">{p.metrics.availableStock}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">{p.metrics.physicalStock}</span>
                  </div>
                  <div className="text-[10px] text-red-500 font-medium mt-0.5" title="Reserved for pending orders">
                    {p.metrics.reservedStock} reserved
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-700">{p.metrics.weeklySales} units/wk</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    {p.metrics.returnRate}% Return Rate
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.metrics.runoutDays < 999 ? (
                    <>
                      <div className={`font-bold ${p.metrics.runoutDays < 15 ? 'text-red-600' : 'text-slate-700'}`}>
                        {p.metrics.runoutDays} Days Left
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Lead time: {p.metrics.leadTime}d
                      </div>
                    </>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] border ${p.metrics.healthColor} inline-flex items-center gap-1`}>
                    {p.metrics.healthStatus === 'Out of Stock' && <AlertTriangle className="w-3 h-3" />}
                    {p.metrics.healthStatus === 'Reorder Now' && <TrendingDown className="w-3 h-3" />}
                    {p.metrics.healthStatus === 'Healthy' && <TrendingUp className="w-3 h-3" />}
                    {p.metrics.healthStatus === 'Overstocked' && <PackageOpen className="w-3 h-3" />}
                    {p.metrics.healthStatus}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    ROP: {p.metrics.rop}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">LKR {p.metrics.inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    Margin: {p.metrics.margin}%
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => handleManualRestock(p)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Adjust Stock
                  </button>
                  {p.metrics.healthStatus === 'Reorder Now' && (
                    <button className="ml-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition-colors shadow-sm">
                      Create PO
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-slate-500 font-medium">
                  No products matched your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Update Stock Modal */}
      {stockModalProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Adjust Physical Stock</h3>
              <button onClick={() => setStockModalProduct(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={submitStockUpdate} className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Product</p>
                <p className="font-semibold text-slate-900 text-sm truncate">{stockModalProduct.name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">SKU: {stockModalProduct.id.toString().substring(0,8).toUpperCase()}</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Stock Count</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-lg font-bold"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setStockModalProduct(null)}
                  className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
