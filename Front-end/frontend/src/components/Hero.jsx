import React, { useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import gsap from 'gsap';

const Hero = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2 },
          '-=0.6'
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-footer-element',
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 overflow-hidden bg-[#08090A]"
    >
      {/* Background Architectural Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=2000"
          alt="Luxury Architecture Studio Villa"
          className="w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.15] scale-105 transform transition-transform duration-1000"
        />
        {/* Dark Architectural Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090A] via-[#08090A]/50 to-[#08090A]/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#08090A]/40 to-[#08090A]/90" />
      </div>

      {/* Grid line overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="max-w-7xl mx-auto h-full border-x border-[#F8FAFC]/10 flex justify-between">
          <div className="w-1/3 border-r border-[#F8FAFC]/10 h-full" />
          <div className="w-1/3 border-r border-[#F8FAFC]/10 h-full" />
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12">
        {/* Top Tagline */}
        <div className="hero-badge inline-flex items-center gap-3 mb-6">
          <span className="w-2 h-2 bg-[#D4C5B0] rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4C5B0] font-medium">
            PREMIUM CONSTRUCTION & ARCHITECTURE
          </span>
        </div>

        {/* Main Headline */}
        <h1
          ref={headlineRef}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#F8FAFC] leading-[0.9] max-w-5xl mb-8"
        >
          WE BUILD <br />
          <span className="italic font-extralight text-[#D4C5B0]">THE FUTURE.</span>
        </h1>

        {/* Subtext Paragraph */}
        <p
          ref={subtextRef}
          className="text-base sm:text-lg md:text-xl text-[#94A3B8] font-light max-w-xl leading-relaxed mb-10"
        >
          Premium construction and architectural solutions built with precision,
          craftsmanship, and purpose.
        </p>

        {/* CTA Button */}
        <div ref={ctaRef} className="flex items-center gap-6">
          <a
            href="#projects"
            className="group btn-primary gap-3"
          >
            <span>EXPLORE OUR WORK</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </a>
        </div>
      </div>

      {/* Bottom Controls & Indicators */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-end justify-between hero-footer-element pt-8 border-t border-[#F8FAFC]/10">
        <a
          href="#intro"
          className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#94A3B8] hover:text-[#D4C5B0] transition-colors duration-300 group"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown
            size={14}
            className="group-hover:translate-y-1 transition-transform duration-300 text-[#D4C5B0]"
          />
        </a>

        {/* Slide counter indicator */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8]">
          <span className="text-[#D4C5B0] font-semibold text-sm">01</span>
          <div className="w-12 h-[1px] bg-[#22252A]" />
          <span>04</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
