import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="group relative cursor-pointer flex flex-col justify-between h-full bg-[#0D0E10] border border-[#22252A] p-4 sm:p-5 transition-all duration-500 hover:border-[#D4C5B0]/50"
    >
      {/* Image Container with Zoom Effect */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#22252A] mb-5">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.1] group-hover:scale-108 group-hover:brightness-[0.95] transition-all duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 bg-[#08090A]/80 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-mono text-[#D4C5B0] border border-[#22252A]">
          {project.number}
        </div>
      </div>

      {/* Info Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2 mb-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] font-medium">
            {project.category}
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#F8FAFC] group-hover:text-[#D4C5B0] transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-xs text-[#64748B] font-light">
            {project.location}
          </p>
        </div>

        {/* Hover Action Link */}
        <div className="pt-4 border-t border-[#22252A] flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors">
          <span>VIEW SPECIFICATIONS</span>
          <ArrowUpRight
            size={18}
            className="text-[#94A3B8] group-hover:text-[#D4C5B0] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
