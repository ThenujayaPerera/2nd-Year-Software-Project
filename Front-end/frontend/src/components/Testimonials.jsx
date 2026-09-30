import React, { useState } from 'react';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';

const testimonialsData = [
  {
    quote:
      'Vertex transformed our vision into a space that exceeded every expectation. Their commitment to structural craftsmanship and detail is unmatched in Sri Lanka.',
    author: 'DR. ANIL PERERA',
    role: 'CLIENT / OCEAN HOUSE OWNER',
    location: 'Colombo',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=1000',
  },
  {
    quote:
      'Delivering a 28,000 sq ft commercial office on time with zero compromise on engineering standards was remarkable. Vertex is our trusted construction studio.',
    author: 'SANJAY SILVA',
    role: 'MANAGING DIRECTOR / VERTEX TOWER',
    location: 'Colombo',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=85&w=1000',
  },
  {
    quote:
      'From complex foundation pilings to delicate timber and glass joinery, Vertex brought architectural purity to Horizon Villa.',
    author: 'ELIZABETH VANDERBERG',
    role: 'ARCHITECTURAL DIRECTOR',
    location: 'Galle',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1000',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialsData.length - 1 : prev - 1
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonialsData.length - 1 ? 0 : prev + 1
    );
  };

  const active = testimonialsData[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-24 md:py-36 bg-[#0D0E10] border-b border-[#22252A]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 items-stretch gap-12 lg:gap-0 border border-[#22252A]">
        {/* Left Column: Architectural Interior Image Frame */}
        <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-[500px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#22252A]">
          <img
            src={active.image}
            alt="Vertex Architecture Testimonial Project"
            className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090A] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 text-xs font-mono text-[#D4C5B0] uppercase tracking-[0.2em]">
            06 / TESTIMONIALS
          </div>
        </div>

        {/* Right Column: High-End Quote Content */}
        <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-[#08090A]">
          <div className="space-y-8">
            <Quote size={40} className="text-[#D4C5B0]/50" />
            
            <blockquote className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-[#F8FAFC] leading-[1.25] tracking-wide italic">
              “{active.quote}”
            </blockquote>
          </div>

          {/* Author attribution + Slider arrows */}
          <div className="pt-12 mt-8 border-t border-[#22252A] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-sm font-semibold tracking-widest text-[#F8FAFC]">
                {active.author}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#D4C5B0]">
                {active.role}
              </div>
            </div>

            {/* Slider Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevTestimonial}
                className="p-3 border border-[#22252A] text-[#94A3B8] hover:text-[#D4C5B0] hover:border-[#D4C5B0] transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 border border-[#22252A] text-[#94A3B8] hover:text-[#D4C5B0] hover:border-[#D4C5B0] transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
