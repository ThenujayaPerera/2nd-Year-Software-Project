import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/home/slides')
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error(err));
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

  if (slides.length === 0) return <div className="h-[480px] md:h-[580px] lg:h-[640px] bg-slate-950 flex items-center justify-center text-white/50">Loading Experience...</div>;

  return (
    <div className="relative h-[480px] md:h-[580px] lg:h-[640px] bg-slate-950 overflow-hidden group">
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
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />

          {/* Content Box */}
          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
            <div className={`max-w-2xl transition-all duration-700 delay-300 ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg font-medium leading-relaxed drop-shadow-md">
                {slide.subtitle}
              </p>
              <div className="flex gap-4">
                <Link
                  to={slide.link}
                  className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-all shadow-2xl hover:shadow-primary/30 flex items-center gap-2 group/btn"
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
        aria-label="Previous Slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-950/80 hover:scale-110 shadow-xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-950/80 hover:scale-110 shadow-xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
