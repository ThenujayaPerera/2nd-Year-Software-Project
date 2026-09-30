import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { target: 15, suffix: '+', label: 'YEARS EXPERIENCE' },
  { target: 120, suffix: '+', label: 'PROJECTS COMPLETED' },
  { target: 35, suffix: '+', label: 'PROFESSIONALS' },
  { target: 98, suffix: '%', label: 'CLIENT SATISFACTION' },
];

const StatCounter = ({ target, suffix, label }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration: 2.2,
              ease: 'power2.out',
              onUpdate: function () {
                setCount(Math.floor(this.targets()[0].val));
              },
            }
          );
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [target]);

  return (
    <div ref={counterRef} className="space-y-2 p-6 border-l border-[#22252A]">
      <div className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#F8FAFC]">
        {count}
        <span className="text-[#D4C5B0] font-light">{suffix}</span>
      </div>
      <div className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] font-medium">
        {label}
      </div>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-[#22252A]">
      {statsData.map((stat, idx) => (
        <StatCounter key={idx} {...stat} />
      ))}
    </div>
  );
};

export default Stats;
