import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Save, X, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function CustomizeHomeTab() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [showroomPhotos, setShowroomPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slidesRes, photosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/home/slides`),
        fetch(`${API_BASE_URL}/home/showroom`)
      ]);
      if (slidesRes.ok) setHeroSlides(await slidesRes.json());
      if (photosRes.ok) setShowroomPhotos(await photosRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Hero Slides CRUD ---
  const handleSaveSlide = async (e) => {
    e.preventDefault();
    const url = editingSlide.id 
      ? `${API_BASE_URL}/home/slides/${editingSlide.id}`
      : `${API_BASE_URL}/home/slides`;
    const method = editingSlide.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide)
      });
      if (res.ok) {
        setEditingSlide(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/home/slides/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Showroom Photos CRUD ---
  const handleSavePhoto = async (e) => {
    e.preventDefault();
    const url = editingPhoto.id 
      ? `${API_BASE_URL}/home/showroom/${editingPhoto.id}`
      : `${API_BASE_URL}/home/showroom`;
    const method = editingPhoto.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPhoto)
      });
      if (res.ok) {
        setEditingPhoto(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/home/showroom/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Customization Data...</div>;

  return (
    <div className="space-y-12">
      {/* HERO SLIDES SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-xl text-slate-900">Hero Slideshow Configuration</h3>
          <button 
            onClick={() => setEditingSlide({ title: '', subtitle: '', image: '', cta: '', link: '', color: 'from-slate-950/85 via-slate-900/40 to-transparent' })}
            className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        {editingSlide && (
          <form onSubmit={handleSaveSlide} className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-blue-900">{editingSlide.id ? 'Edit Slide' : 'New Slide'}</h4>
              <button type="button" onClick={() => setEditingSlide(null)} className="text-slate-500 hover:text-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input required value={editingSlide.title} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input required value={editingSlide.subtitle} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input required type="url" value={editingSlide.image} onChange={e => setEditingSlide({...editingSlide, image: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gradient Color (Tailwind classes)</label>
                <input required value={editingSlide.color} onChange={e => setEditingSlide({...editingSlide, color: e.target.value})} className="w-full px-3 py-2 border rounded-xl font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CTA Text</label>
                <input required value={editingSlide.cta} onChange={e => setEditingSlide({...editingSlide, cta: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link URL</label>
                <input required value={editingSlide.link} onChange={e => setEditingSlide({...editingSlide, link: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl mt-4 hover:bg-blue-700">Save Slide</button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {heroSlides.map(slide => {
            const displayUrl = slide.image.startsWith('/') ? `http://localhost:5173${slide.image}` : slide.image;
            return (
              <div key={slide.id} className="border border-slate-200 rounded-2xl overflow-hidden relative group">
                <img src={displayUrl} alt={slide.title} className="w-full h-32 object-cover" />
                <div className="p-4 bg-white">
                  <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{slide.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-1">{slide.subtitle}</p>
                </div>
                <div className="hidden md:flex absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingSlide(slide)} className="p-2 bg-white text-blue-600 rounded-lg shadow"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 bg-white text-red-600 rounded-lg shadow"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* SHOWROOM PHOTOS SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-xl text-slate-900">Step Inside NVSHOP.LK (Showroom Photos)</h3>
          <button 
            onClick={() => setEditingPhoto({ tag: '', tagColor: 'text-blue-400', title: '', subtitle: '', fullDesc: '', image: '', gridClass: 'col-span-1 aspect-[4/3]' })}
            className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        </div>

        {editingPhoto && (
          <form onSubmit={handleSavePhoto} className="mb-8 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-emerald-900">{editingPhoto.id ? 'Edit Showroom Photo' : 'New Showroom Photo'}</h4>
              <button type="button" onClick={() => setEditingPhoto(null)} className="text-slate-500 hover:text-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input required value={editingPhoto.title} onChange={e => setEditingPhoto({...editingPhoto, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input required value={editingPhoto.subtitle} onChange={e => setEditingPhoto({...editingPhoto, subtitle: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tag (e.g. OFFICIAL HUB)</label>
                <input required value={editingPhoto.tag} onChange={e => setEditingPhoto({...editingPhoto, tag: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tag Color (e.g. text-blue-400)</label>
                <input required value={editingPhoto.tagColor} onChange={e => setEditingPhoto({...editingPhoto, tagColor: e.target.value})} className="w-full px-3 py-2 border rounded-xl font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input required type="url" value={editingPhoto.image} onChange={e => setEditingPhoto({...editingPhoto, image: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Grid CSS Class (e.g. col-span-1)</label>
                <input required value={editingPhoto.gridClass} onChange={e => setEditingPhoto({...editingPhoto, gridClass: e.target.value})} className="w-full px-3 py-2 border rounded-xl font-mono text-xs" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Description (for Modal)</label>
                <textarea required rows={2} value={editingPhoto.fullDesc} onChange={e => setEditingPhoto({...editingPhoto, fullDesc: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl mt-4 hover:bg-emerald-700">Save Photo</button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showroomPhotos.map(photo => {
            const displayUrl = photo.image.startsWith('/') ? `http://localhost:5173${photo.image}` : photo.image;
            return (
              <div key={photo.id} className="border border-slate-200 rounded-2xl overflow-hidden relative group">
                <img src={displayUrl} alt={photo.title} className="w-full h-40 object-cover" />
                <div className="p-4 bg-white space-y-1">
                  <span className={`text-[10px] font-bold ${photo.tagColor}`}>{photo.tag}</span>
                  <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{photo.title}</h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{photo.fullDesc}</p>
                </div>
                <div className="hidden md:flex absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingPhoto(photo)} className="p-2 bg-white text-emerald-600 rounded-lg shadow"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDeletePhoto(photo.id)} className="p-2 bg-white text-red-600 rounded-lg shadow"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
