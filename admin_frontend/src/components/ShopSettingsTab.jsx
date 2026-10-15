import { useState, useEffect } from 'react';
import { Store, Bot, Database, Sparkles, Save, RefreshCw, Plus, Trash2, Check, AlertCircle, Cpu, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8080/api';

export default function ShopSettingsTab() {
  const [shop, setShop] = useState({
    shopName: 'NVSHOP.LK',
    tagline: "Sri Lanka's Premier Tech & Apple Accessories Store",
    description: '',
    hotline: '+94 77 123 4567',
    whatsapp: '+94 77 123 4567',
    phoneSecondary: '+94 91 225 6789',
    email: 'support@nvshop.lk',
    supportEmail: 'orders@nvshop.lk',
    address: '185/1/2B New Road, Ambalangoda, Sri Lanka',
    city: 'Ambalangoda',
    postalCode: '80300',
    businessHours: '',
    warrantyPolicy: '',
    returnPolicy: '',
    shippingPolicy: '',
    paymentMethods: '',
    showroomInfo: '',
  });

  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingShop, setSavingShop] = useState(false);
  const [syncingVectors, setSyncingVectors] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // New Chunk modal / form
  const [newChunk, setNewChunk] = useState({ category: 'STORE_OVERVIEW', title: '', content: '' });
  const [showAddChunk, setShowAddChunk] = useState(false);

  // AI Test Query
  const [testQuery, setTestQuery] = useState('What are your delivery fees and warranty policies?');
  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Live API Health State
  const [apiHealth, setApiHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shopRes, knowRes, healthRes] = await Promise.all([
        axios.get(`${API_BASE}/shop/details`).catch(() => null),
        axios.get(`${API_BASE}/admin/ai/knowledge`).catch(() => null),
        axios.get(`${API_BASE}/admin/ai/check`).catch(() => null),
      ]);

      if (shopRes?.data) setShop(shopRes.data);
      if (knowRes?.data) setKnowledgeList(knowRes.data);
      if (healthRes?.data) setApiHealth(healthRes.data);
    } catch (err) {
      console.warn("Failed to load shop/ai details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/ai/check`);
      setApiHealth(res.data);
    } catch (err) {
      console.warn("Health check error:", err);
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleSaveShop = async (e) => {
    e.preventDefault();
    setSavingShop(true);
    setAlertMsg(null);
    try {
      const res = await axios.put(`${API_BASE}/admin/shop/details`, shop);
      if (res.data) setShop(res.data);
      setAlertMsg({ type: 'success', text: 'Store details updated successfully in database!' });
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update store details. Check backend connection.' });
    } finally {
      setSavingShop(false);
    }
  };

  const handleSyncVectors = async () => {
    setSyncingVectors(true);
    setAlertMsg(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/ai/sync-embeddings`);
      setAlertMsg({ 
        type: 'success', 
        text: `Vector sync complete: ${res.data?.syncedCount || 0} chunks embedded in Supabase pgvector.` 
      });
      fetchData();
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Vector sync failed. Ensure GEMINI_API_KEY is configured in backend.' });
    } finally {
      setSyncingVectors(false);
    }
  };

  const handleAddChunk = async (e) => {
    e.preventDefault();
    if (!newChunk.title || !newChunk.content) return;
    try {
      await axios.post(`${API_BASE}/admin/ai/knowledge`, newChunk);
      setNewChunk({ category: 'STORE_OVERVIEW', title: '', content: '' });
      setShowAddChunk(false);
      fetchData();
      setAlertMsg({ type: 'success', text: 'New knowledge chunk added to vector dataset.' });
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to save knowledge chunk.' });
    }
  };

  const handleDeleteChunk = async (id) => {
    if (!window.confirm('Delete this knowledge chunk?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/ai/knowledge/${id}`);
      fetchData();
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to delete knowledge chunk.' });
    }
  };

  const handleTestAi = async () => {
    if (!testQuery.trim()) return;
    setTestingAi(true);
    setTestResult(null);
    try {
      const res = await axios.post(`${API_BASE}/ai/ask`, { question: testQuery });
      setTestResult(res.data);
    } catch (err) {
      setTestResult({
        answer: 'Failed to connect to AI assistant endpoint.',
        llmModel: 'Error',
        latencyMs: 0
      });
    } finally {
      setTestingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 font-medium">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-600" /> Loading store profile & vector data...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Cpu className="w-3.5 h-3.5" /> Groq LLM + Gemini pgvector RAG
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Store Details & AI Knowledge Engine</h2>
            <p className="text-blue-100/80 text-sm mt-1 max-w-2xl">
              Manage core store credentials, hotline, address, warranty policies, and synchronize your Supabase vector dataset with zero local embedding installation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <button
              onClick={handleCheckHealth}
              disabled={checkingHealth}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all disabled:opacity-50"
              title="Test API Key Connectivity"
            >
              <Cpu className={`w-4 h-4 ${checkingHealth ? 'animate-spin' : ''}`} />
              {checkingHealth ? 'Checking...' : 'Check API Status'}
            </button>
            <button
              onClick={handleSyncVectors}
              disabled={syncingVectors}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${syncingVectors ? 'animate-spin' : ''}`} />
              {syncingVectors ? 'Generating Embeddings...' : 'Sync pgvector Chunks'}
            </button>
          </div>
        </div>

        {/* Live Diagnostics Cards */}
        {apiHealth && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-white/10 mt-6 text-xs">
            {/* Groq Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Groq Cloud LLM</span>
                <span className="font-semibold text-white">{apiHealth.groq?.model || 'llama-3.3-70b'}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                apiHealth.groq?.status === 'HEALTHY'
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              }`}>
                {apiHealth.groq?.status || 'CHECK'}
              </span>
            </div>

            {/* Gemini Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-200 block">Gemini Embeddings</span>
                <span className="font-semibold text-white">{apiHealth.gemini?.dimensions ? `${apiHealth.gemini.dimensions}d Vector` : 'text-embedding-004'}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                apiHealth.gemini?.status === 'HEALTHY'
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              }`}>
                {apiHealth.gemini?.status || 'CHECK'}
              </span>
            </div>

            {/* pgvector Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">Supabase pgvector</span>
                <span className="font-semibold text-white">{apiHealth.pgvector?.embeddedChunksCount ?? 0} Chunks Embedded</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                apiHealth.pgvector?.status === 'HEALTHY'
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              }`}>
                {apiHealth.pgvector?.status || 'CHECK'}
              </span>
            </div>
          </div>
        )}
      </div>

      {alertMsg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold border ${
          alertMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {alertMsg.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Grid: Store Details Form & AI Vector Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Master Store Details */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Master Store Information</h3>
              <p className="text-xs text-slate-500">Live details served across customer storefront and RAG answers</p>
            </div>
          </div>

          <form onSubmit={handleSaveShop} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Shop Name</label>
                <input
                  type="text"
                  value={shop.shopName || ''}
                  onChange={(e) => setShop({ ...shop, shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Official Hotline</label>
                <input
                  type="text"
                  value={shop.hotline || ''}
                  onChange={(e) => setShop({ ...shop, hotline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                <input
                  type="text"
                  value={shop.whatsapp || ''}
                  onChange={(e) => setShop({ ...shop, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Support Email</label>
                <input
                  type="email"
                  value={shop.email || ''}
                  onChange={(e) => setShop({ ...shop, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Physical Address</label>
              <input
                type="text"
                value={shop.address || ''}
                onChange={(e) => setShop({ ...shop, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Business Hours</label>
              <textarea
                rows="2"
                value={shop.businessHours || ''}
                onChange={(e) => setShop({ ...shop, businessHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Warranty Policy Overview</label>
              <textarea
                rows="2"
                value={shop.warrantyPolicy || ''}
                onChange={(e) => setShop({ ...shop, warrantyPolicy: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Shipping & Delivery Rates</label>
              <textarea
                rows="2"
                value={shop.shippingPolicy || ''}
                onChange={(e) => setShop({ ...shop, shippingPolicy: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Payment Methods & BNPL (Koko)</label>
              <textarea
                rows="2"
                value={shop.paymentMethods || ''}
                onChange={(e) => setShop({ ...shop, paymentMethods: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingShop}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <Save className="w-4 h-4" />
              {savingShop ? 'Saving Details...' : 'Save Store Details'}
            </button>
          </form>
        </div>

        {/* Right: Vector Dataset Chunks & RAG Assistant Test */}
        <div className="lg:col-span-5 space-y-6">
          {/* RAG Assistant Live Tester */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">RAG Assistant Live Tester</h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Groq 70B Live
              </span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Ask any question about NVSHOP.LK..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleTestAi}
                disabled={testingAi}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {testingAi ? 'Retrieving pgvector Chunks & Thinking...' : 'Test AI Query'}
              </button>

              {testResult && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Model: {testResult.llmModel}</span>
                    <span>Latency: {testResult.latencyMs}ms</span>
                  </div>
                  <div className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                    {testResult.answer}
                  </div>
                  {testResult.sources?.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Sources:</span>
                      {testResult.sources.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-600">
                          {s.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Knowledge Base Chunks */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">pgvector Chunks ({knowledgeList.length})</h3>
              </div>
              <button
                onClick={() => setShowAddChunk(!showAddChunk)}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                title="Add Knowledge Chunk"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showAddChunk && (
              <form onSubmit={handleAddChunk} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <select
                  value={newChunk.category}
                  onChange={(e) => setNewChunk({ ...newChunk, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="STORE_OVERVIEW">Store Overview & Location</option>
                  <option value="WARRANTY_POLICY">Warranty & Guarantee</option>
                  <option value="SHIPPING_DELIVERY">Shipping & Delivery Fees</option>
                  <option value="PAYMENT_METHODS">Payment Options & Koko BNPL</option>
                  <option value="SHOWROOM_VR">VR Showroom & Testing</option>
                  <option value="RETURN_REFUND">Return & Refund Policy</option>
                  <option value="AUTHENTICITY">Authenticity Guarantee</option>
                </select>
                <input
                  type="text"
                  placeholder="Chunk Title (e.g., Ambalangoda Showroom)"
                  value={newChunk.title}
                  onChange={(e) => setNewChunk({ ...newChunk, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
                <textarea
                  placeholder="Knowledge Content for Vector Embedding..."
                  rows="3"
                  value={newChunk.content}
                  onChange={(e) => setNewChunk({ ...newChunk, content: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddChunk(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Save Chunk
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {knowledgeList.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No knowledge chunks found. Click '+' or sync from backend.</p>
              ) : (
                knowledgeList.map((chunk) => (
                  <div key={chunk.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors space-y-1 relative group">
                    <div className="flex items-start justify-between pr-6">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {chunk.category}
                      </span>
                      <button
                        onClick={() => handleDeleteChunk(chunk.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                        title="Delete chunk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{chunk.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{chunk.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
