import React, { useEffect, useRef } from 'react';
import Stats from './Stats';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-anim', {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={aboutRef}
      className="py-24 md:py-36 px-6 md:px-12 bg-[#08090A] border-b border-[#22252A]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Headline */}
          <div className="lg:col-span-6 space-y-6">
            <div className="about-anim section-label">
              <span>05</span>
              <div className="w-8 h-[1px] bg-[#D4C5B0]" />
              <span>ABOUT VERTEX</span>
            </div>
            <h2 className="about-anim font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#F8FAFC] leading-[1.05]">
              BUILT ON <br />
              <span className="italic text-[#D4C5B0]">EXPERIENCE.</span> <br />
              DEFINED BY CRAFT.
            </h2>
          </div>

          {/* Narrative Story */}
          <div className="lg:col-span-6 space-y-8 lg:pt-12">
            <p className="about-anim text-base md:text-lg text-[#94A3B8] font-light leading-relaxed">
              Vertex Construction combines construction expertise, architectural thinking,
              experienced engineering teams, and painstaking attention to detail to bring
              extraordinary structural projects to life across Sri Lanka.
            </p>
            
            <div className="about-anim grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs uppercase tracking-[0.15em] text-[#F8FAFC]">
              {[
                'Architectural Rigor',
                'Uncompromising Safety',
                'Bespoke Materials',
                'Transparent Timelines',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#0D0E10] border border-[#22252A]">
                  <CheckCircle2 size={16} className="text-[#D4C5B0]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Statistics Section */}
        <div className="about-anim">
          <Stats />
        </div>
      </div>
    </section>
  );
};

export default About;
