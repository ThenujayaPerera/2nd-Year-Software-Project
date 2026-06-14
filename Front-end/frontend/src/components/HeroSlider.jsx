import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Premium Mobile Cases',
    subtitle: 'Protection meets style with our exclusive collection.',
    image: '/hero_phone_cases.png',
    cta: 'Shop Cases',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 2,
    title: 'Charging Revolution',
    subtitle: 'Lightning fast power for all your devices.',
    image: '/hero_charging_tech.png',
    cta: 'Explore Power',
    color: 'from-slate-800 to-slate-900',
  },
  {
    id: 3,
    title: 'Sonic Perfection',
    subtitle: 'Experience sound like never before.',
    image: '/hero_wireless_audio.png',
    cta: 'Browse Audio',
    color: 'from-emerald-600 to-teal-700',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-90`} />
          
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
            <div className={`max-w-2xl transition-all duration-700 delay-300 ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-lg">
                {slide.subtitle}
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 group/btn"
                >
                  {slide.cta}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              index === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
