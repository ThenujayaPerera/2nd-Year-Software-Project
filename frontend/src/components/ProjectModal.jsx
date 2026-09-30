import React, { useEffect } from 'react';
import { X, MapPin, Calendar, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#08090A]/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0D0E10] border border-[#22252A] p-6 sm:p-10 md:p-12 my-auto shadow-2xl text-[#F8FAFC]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#94A3B8] hover:text-[#D4C5B0] hover:bg-[#22252A] transition-all duration-300 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 mb-8 border-b border-[#22252A] pb-6">
          <div className="flex items-center gap-3 text-xs font-mono text-[#D4C5B0]">
            <span>{project.number}</span>
            <span>/</span>
            <span className="uppercase tracking-[0.2em]">{project.category}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-[#F8FAFC]">
            {project.title}
          </h2>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
            <MapPin size={14} className="text-[#D4C5B0]" />
            <span>{project.location}</span>
          </div>
        </div>

        {/* Main Image Banner */}
        <div className="relative h-[300px] sm:h-[420px] overflow-hidden border border-[#22252A] mb-8">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
          />
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#22252A]">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#64748B]">SCOPE & TYPE</span>
            <p className="text-sm font-medium text-[#F8FAFC]">{project.category}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#64748B]">YEAR COMPLETED</span>
            <p className="text-sm font-mono text-[#D4C5B0]">{project.year || '2024'}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#64748B]">FLOOR AREA</span>
            <p className="text-sm font-mono text-[#F8FAFC]">{project.area || '12,500 SQ FT'}</p>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs uppercase tracking-[0.25em] text-[#D4C5B0]">ARCHITECTURAL BRIEF</h3>
          <p className="text-base text-[#94A3B8] font-light leading-relaxed">
            {project.description ||
              `Designed and built with uncompromising precision, ${project.title} stands as a benchmark of modern architectural craftsmanship in ${project.location}. Featuring seamless indoor-outdoor transitions, sustainable timber and exposed concrete accents, and custom structural engineering.`}
          </p>
        </div>

        {/* Secondary Detail Gallery Grid */}
        {project.gallery && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {project.gallery.map((img, idx) => (
              <div key={idx} className="h-44 overflow-hidden border border-[#22252A]">
                <img
                  src={img}
                  alt={`Detail ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Modal Action CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#22252A]">
          <span className="text-xs text-[#64748B] font-mono">
            REF ID: VERTEX-{project.number.replace(' ', '')}-LK
          </span>
          <a
            href="#contact"
            onClick={onClose}
            className="btn-primary gap-2 w-full sm:w-auto"
          >
            <span>DISCUSS SIMILAR PROJECT</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
