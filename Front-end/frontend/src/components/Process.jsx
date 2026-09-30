import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    number: '01',
    title: 'DISCOVER',
    description: 'Understanding the vision, site parameters, regulatory requirements, and project budget.',
    detail: 'In-depth consultation, land surveys, structural feasibility analysis, and timeline mapping.',
  },
  {
    number: '02',
    title: 'DESIGN',
    description: 'Developing architectural concepts, structural blueprints, and material specifications.',
    detail: '3D BIM visualizations, engineering calculations, permits acquisition, and client reviews.',
  },
  {
    number: '03',
    title: 'BUILD',
    description: 'Executing construction with unyielding precision, safety, and strict quality control.',
    detail: 'Master masonry, heavy structural framing, glass installations, and site supervision.',
  },
  {
    number: '04',
    title: 'DELIVER',
    description: 'Completing the project and delivering a finished space engineered to last generations.',
    detail: 'Commissioning mechanical systems, final interior polish, and seamless client handover.',
  },
];

const Process = () => {
  const processRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-card-anim', {
        scrollTrigger: {
          trigger: processRef.current,
          start: 'top 70%',
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, processRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={processRef}
      className="py-24 md:py-36 px-6 md:px-12 bg-[#08090A] border-b border-[#22252A]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="pb-8 border-b border-[#22252A]">
          <div className="section-label">
            <span>04</span>
            <div className="w-8 h-[1px] bg-[#D4C5B0]" />
            <span>OUR PROCESS</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#F8FAFC]">
            PRECISION <br />
            <span className="italic text-[#D4C5B0]">AT EVERY STEP.</span>
          </h2>
        </div>

        {/* 4 Stage Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div
              key={step.number}
              className="process-card-anim relative group flex flex-col justify-between bg-[#0D0E10] border border-[#22252A] p-8 hover:border-[#D4C5B0]/40 transition-all duration-500"
            >
              {/* Step Line Header */}
              <div>
                <div className="flex items-center justify-between border-b border-[#22252A] pb-6 mb-6">
                  <span className="font-mono text-xl text-[#D4C5B0] font-semibold">
                    {step.number} /
                  </span>
                  <div className="w-2 h-2 bg-[#22252A] group-hover:bg-[#D4C5B0] transition-colors duration-300" />
                </div>

                <h3 className="font-serif text-2xl text-[#F8FAFC] font-light mb-4 group-hover:text-[#D4C5B0] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-[#94A3B8] font-light leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Step Detail Footer */}
              <div className="pt-6 border-t border-[#22252A]/80 text-xs text-[#64748B] font-light">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
