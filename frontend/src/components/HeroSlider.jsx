import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';

const DEFAULT_SLIDES = [
  {
    id: 1,
    title: 'Premium Mobile Cases',
    subtitle: 'Protection meets style with our exclusive collection.',
    image: '/slides/slide0001.png',
    color: 'from-blue-950/80 via-blue-900/40 to-transparent',
    link: '/products?category=Cases'
  },
  {
    id: 2,
    title: 'Next-Gen Power & Fast Charging',
    subtitle: 'High-speed GaN chargers & cables for Apple, Samsung & Android.',
    image: '/slides/slide0002.png',
    color: 'from-slate-950/85 via-slate-900/40 to-transparent',
    link: '/products?category=Chargers'
  },
  {
    id: 3,
    title: 'Pure Bass & Studio Audio',
    subtitle: 'Immerse in sound with genuine wireless earbuds & headphones.',
    image: '/slides/slide0003.png',
    color: 'from-indigo-950/85 via-indigo-900/40 to-transparent',
    link: '/products?category=Audio'
  },
  {
    id: 4,
    title: 'Ultimate Gaming & Smart Tech',
    subtitle: 'PS5 accessories, VR headsets, and smart tech essentials.',
    image: '/slides/slide0004.png',
    color: 'from-slate-900/85 via-blue-950/40 to-transparent',
    link: '/products'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
    fetch(`${API_BASE_URL}/home/slides`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(() => {
        // Keep default slides
      });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  if (slides.length === 0) return <div className="h-[380px] sm:h-[480px] md:h-[580px] lg:h-[640px] bg-slate-950 flex items-center justify-center text-white/50 text-sm">Loading Experience...</div>;

  return (
    <div className="relative h-[380px] sm:h-[480px] md:h-[580px] lg:h-[640px] bg-slate-950 overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Main Slide Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Elegant Dark Gradient Overlay for Readability */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-85 sm:opacity-100`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/30" />

          {/* Content Box */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center">
            <div className={`max-w-2xl transition-all duration-700 delay-300 pr-2 ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-2.5 sm:mb-6 leading-tight drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-base md:text-xl text-slate-200 mb-5 sm:mb-8 max-w-lg font-medium leading-relaxed drop-shadow-md line-clamp-3 sm:line-clamp-none">
                {slide.subtitle}
              </p>
              <div className="flex gap-3 sm:gap-4">
                <Link
                  to={slide.link}
                  className="bg-white text-slate-950 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/30 flex items-center gap-1.5 sm:gap-2 group/btn active:scale-95"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on Mobile to avoid obscuring text, visible on md+ */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-950/80 hover:scale-110 shadow-xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-950/80 hover:scale-110 shadow-xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 shadow-2xl">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-6 sm:w-8 bg-white' : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
