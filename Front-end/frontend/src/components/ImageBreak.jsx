import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ImageBreak = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: -60,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden bg-[#08090A] flex items-center justify-center border-b border-[#22252A]"
    >
      {/* Background Parallax Architectural Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=85&w=2000"
          alt="Crafted With Purpose Architecture"
          className="w-full h-[120%] object-cover object-center filter brightness-[0.55] contrast-[1.15] scale-105"
        />
        {/* Dark Architectural Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090A] via-[#08090A]/40 to-[#08090A]" />
        <div className="absolute inset-0 bg-[#08090A]/40" />
      </div>

      {/* Center Overlay Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-3">
          <span className="text-xs font-mono text-[#D4C5B0]">05</span>
          <div className="w-8 h-[1px] bg-[#D4C5B0]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4C5B0]">
            ARCHITECTURAL PHILOSOPHY
          </span>
        </div>

        <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-[#F8FAFC] tracking-tight leading-none">
          CRAFTED <br />
          <span className="italic font-extralight text-[#D4C5B0]">WITH PURPOSE.</span>
        </h2>
      </div>
    </section>
  );
};

export default ImageBreak;
