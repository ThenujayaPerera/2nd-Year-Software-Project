import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
  const introRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro-anim', {
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, introRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro"
      ref={introRef}
      className="py-24 md:py-36 px-6 md:px-12 bg-[#08090A] border-b border-[#22252A]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Typography & Story */}
        <div className="lg:col-span-7 space-y-8">
          <div className="intro-anim section-label">
            <span>01</span>
            <div className="w-8 h-[1px] bg-[#D4C5B0]" />
            <span>WHO WE ARE</span>
          </div>

          <h2 className="intro-anim font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#F8FAFC] leading-[1.05]">
            WE TURN <br />
            <span className="italic text-[#D4C5B0]">BOLD IDEAS</span> <br />
            INTO BUILT REALITY.
          </h2>

          <div className="intro-anim space-y-6 pt-4 border-t border-[#22252A] max-w-xl">
            <p className="text-base md:text-lg text-[#94A3B8] font-light leading-relaxed">
              Vertex Construction delivers high-quality residential, commercial, and
              architectural projects, combining modern design, expert craftsmanship,
              and an unyielding commitment to excellence in every detail.
            </p>
            <p className="text-sm text-[#64748B] font-light leading-relaxed">
              From landmark structural developments to bespoke private residences across Sri Lanka,
              our team brings visionary architecture to life through rigorous engineering and luxury finishes.
            </p>
          </div>

          <div className="intro-anim pt-4">
            <a
              href="#about"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#D4C5B0] font-semibold hover:text-[#F8FAFC] transition-colors group"
            >
              <span>OUR STORY</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-2 transition-transform duration-300"
              />
            </a>
          </div>
        </div>

        {/* Right Column: Editorial Construction Sunset Image */}
        <div className="lg:col-span-5 intro-anim">
          <div className="relative group overflow-hidden border border-[#22252A]">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=85&w=1200"
              alt="Vertex Construction Site at Dusk"
              className="w-full h-[400px] sm:h-[500px] object-cover filter brightness-[0.75] contrast-[1.1] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090A] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>STRUCTURAL ENGINEERING</span>
              <span className="text-[#D4C5B0]">EST. 2011</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
