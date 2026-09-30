import React, { useState, useRef, useEffect } from 'react';
import { HardHat, Compass, Home, Building2, RotateCcw, Plus, Minus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const servicesList = [
  {
    id: '01',
    title: 'GENERAL CONSTRUCTION',
    icon: HardHat,
    subtitle: 'Turnkey Construction & Civil Engineering',
    description:
      'Complete end-to-end site execution, steel framing, foundation engineering, and quality control delivered according to rigorous structural standards.',
    deliverables: ['Civil Engineering', 'Structural Concrete', 'Project Supervision', 'Site Management'],
  },
  {
    id: '02',
    title: 'ARCHITECTURAL BUILD',
    icon: Compass,
    subtitle: 'Bespoke Architectural Engineering',
    description:
      'Translating complex architectural concepts into high-fidelity built structures using advanced bim modeling, glass engineering, and modern raw material finishes.',
    deliverables: ['BIM & 3D Drafting', 'Custom Facades', 'Structural Detailing', 'Material Craftsmanship'],
  },
  {
    id: '03',
    title: 'RESIDENTIAL PROJECTS',
    icon: Home,
    subtitle: 'Ultra-Luxury Villas & Private Estates',
    description:
      'Bespoke luxury home construction crafted for coastal and urban living, featuring smart automation integration, infinity swimming pools, and custom interior masonry.',
    deliverables: ['Custom Ocean Villas', 'Private Estates', 'Luxury Interior Build', 'Pool & Landscape'],
  },
  {
    id: '04',
    title: 'COMMERCIAL DEVELOPMENT',
    icon: Building2,
    subtitle: 'High-Rise & Office Headquarters',
    description:
      'Scalable commercial spaces, boutique corporate headquarters, and high-rise office towers engineered for longevity, acoustic control, and energy efficiency.',
    deliverables: ['Corporate Towers', 'Mixed-Use Retail', 'Acoustic Engineering', 'LEED Compliance'],
  },
  {
    id: '05',
    title: 'RENOVATION & RESTORATION',
    icon: RotateCcw,
    subtitle: 'Heritage & Modern Adaptive Re-use',
    description:
      'Precision structural retrofitting, historical facade preservation, and high-end modern interior updates for colonial and contemporary properties.',
    deliverables: ['Structural Retrofitting', 'Heritage Restoration', 'Interior Refurbishment', 'Facade Modernization'],
  },
];

const Services = () => {
  const [expandedId, setExpandedId] = useState('01');
  const servicesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-item-anim', {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, servicesRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={servicesRef}
      className="py-24 md:py-36 px-6 md:px-12 bg-[#0D0E10] border-b border-[#22252A]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="pb-8 border-b border-[#22252A]">
          <div className="section-label">
            <span>03</span>
            <div className="w-8 h-[1px] bg-[#D4C5B0]" />
            <span>WHAT WE DO</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#F8FAFC]">
            FROM GROUND <br />
            <span className="italic text-[#D4C5B0]">TO COMPLETION.</span>
          </h2>
        </div>

        {/* 5 Minimal Horizontal Expandable Accordion Service Cards */}
        <div className="space-y-4">
          {servicesList.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                onClick={() => setExpandedId(isExpanded ? null : service.id)}
                className={`service-item-anim group cursor-pointer border border-[#22252A] p-6 md:p-8 transition-all duration-500 ${
                  isExpanded
                    ? 'bg-[#131518] border-[#D4C5B0]/50 shadow-2xl'
                    : 'bg-[#08090A] hover:border-[#94A3B8]/30 hover:bg-[#0D0E10]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Number + Icon + Title */}
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono text-[#D4C5B0] tracking-widest w-6">
                      {service.id}
                    </span>
                    <div className="p-3 bg-[#1B1E23] border border-[#22252A] text-[#D4C5B0] group-hover:border-[#D4C5B0]/40 transition-colors">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-[#F8FAFC] group-hover:text-[#D4C5B0] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] font-light mt-1">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Toggle indicator */}
                  <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8] self-end md:self-center">
                    <span className="hidden sm:inline uppercase tracking-[0.2em]">
                      {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                    </span>
                    <div className="p-2 border border-[#22252A] text-[#D4C5B0] rounded-none">
                      {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expandable Content Area */}
                {isExpanded && (
                  <div className="mt-8 pt-6 border-t border-[#22252A] grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                    <div className="lg:col-span-7 space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.25em] text-[#D4C5B0]">
                        SERVICE OVERVIEW
                      </h4>
                      <p className="text-base text-[#94A3B8] font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.25em] text-[#D4C5B0]">
                        CORE DELIVERABLES
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {service.deliverables.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-[#F8FAFC] font-light"
                          >
                            <span className="w-1.5 h-1.5 bg-[#D4C5B0]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
