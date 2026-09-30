import React, { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 'ocean-house',
    number: '01',
    title: 'OCEAN HOUSE',
    category: 'Luxury Residential',
    filterCategory: 'RESIDENTIAL',
    location: 'Colombo, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=85&w=1200',
    year: '2024',
    area: '14,200 SQ FT',
    description:
      'A multi-level coastal villa integrating cantilevers, infinity poolside decks, and floor-to-ceiling double-glazed minimalist glazing overlooking the Indian Ocean.',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'the-courtyard',
    number: '02',
    title: 'THE COURTYARD',
    category: 'Commercial Architecture',
    filterCategory: 'COMMERCIAL',
    location: 'Colombo, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=85&w=1200',
    year: '2023',
    area: '28,500 SQ FT',
    description:
      'An modern administrative glass and concrete workspace designed around a central biophilic open-air atrium, providing solar shading and passive ventilation.',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'horizon-villa',
    number: '03',
    title: 'HORIZON VILLA',
    category: 'Residential Construction',
    filterCategory: 'RESIDENTIAL',
    location: 'Galle, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1200',
    year: '2024',
    area: '9,800 SQ FT',
    description:
      'Perched on Galle hilltops, Horizon Villa features native granite masonry, titanium polished floors, and an expansive cantilevered concrete lounge.',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'north-tower',
    number: '04',
    title: 'NORTH TOWER',
    category: 'Commercial Development',
    filterCategory: 'COMMERCIAL',
    location: 'Colombo, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=85&w=1200',
    year: '2025',
    area: '75,000 SQ FT',
    description:
      'A 18-storey high-rise commercial landmark with custom curtain wall facade engineering, earthquake-resistant core framing, and high-efficiency smart mechanical systems.',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
    ],
  },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);
  const projectsRef = useRef(null);

  const filteredProjects =
    activeFilter === 'ALL'
      ? projectsData
      : projectsData.filter((p) => p.filterCategory === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card-wrapper', {
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, projectsRef);

    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <section
      id="projects"
      ref={projectsRef}
      className="py-24 md:py-36 px-6 md:px-12 bg-[#08090A] border-b border-[#22252A]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#22252A]">
          <div>
            <div className="section-label">
              <span>02</span>
              <div className="w-8 h-[1px] bg-[#D4C5B0]" />
              <span>SELECTED PROJECTS</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#F8FAFC]">
              OUR WORK
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-4 text-xs font-mono">
            {['ALL', 'RESIDENTIAL', 'COMMERCIAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#D4C5B0] text-[#08090A] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] border border-[#22252A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card-wrapper">
              <ProjectCard project={project} onClick={setSelectedProject} />
            </div>
          ))}
        </div>

        {/* Modal Popup Viewer */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};

export default Projects;
