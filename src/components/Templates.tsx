'use client';

import { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { TEMPLATES } from '@/lib/constants';

// Category color mapping
const categoryColors: Record<string, { bg: string; border: string; glow: string }> = {
  pink: {
    bg: 'bg-pink-500/20',
    border: 'group-hover:border-pink-500/50',
    glow: 'group-hover:shadow-pink-500/20',
  },
  rose: {
    bg: 'bg-rose-500/20',
    border: 'group-hover:border-rose-500/50',
    glow: 'group-hover:shadow-rose-500/20',
  },
  green: {
    bg: 'bg-emerald-500/20',
    border: 'group-hover:border-emerald-500/50',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-500/20',
    border: 'group-hover:border-blue-500/50',
    glow: 'group-hover:shadow-blue-500/20',
  },
  amber: {
    bg: 'bg-amber-500/20',
    border: 'group-hover:border-amber-500/50',
    glow: 'group-hover:shadow-amber-500/20',
  },
  purple: {
    bg: 'bg-brand-500/20',
    border: 'group-hover:border-brand-500/50',
    glow: 'group-hover:shadow-brand-500/20',
  },
};

const categoryBadgeColors: Record<string, string> = {
  pink: 'bg-pink-500/80 text-white',
  rose: 'bg-rose-500/80 text-white',
  green: 'bg-emerald-500/80 text-white',
  blue: 'bg-blue-500/80 text-white',
  amber: 'bg-amber-500/80 text-slate-900',
  purple: 'bg-brand-500/80 text-white',
};

export default function Templates() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="templates" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900/50 to-slate-950"></div>
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <span className="text-sm text-slate-300">Koleksi Premium</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Templat <span className="bg-linear-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">Premium</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Pilih dari koleksi templat profesional yang direka khas untuk pelbagai industri.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TEMPLATES.map((template, index) => {
            const colors = categoryColors[template.color] || categoryColors.purple;
            const badgeColor = categoryBadgeColors[template.color] || categoryBadgeColors.purple;
            
            return (
              <div
                key={template.id}
                className={`group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm transition-all duration-500 ease-out cursor-pointer animate-fade-in-up ${colors.border} ${colors.glow} hover:shadow-2xl hover:scale-[1.02] hover:-rotate-1`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-brand-500 via-pink-500 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
                <div className="absolute inset-px rounded-xl bg-slate-900 -z-10"></div>

                {/* Template Image */}
                <div className="aspect-4/3 overflow-hidden relative">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Hover overlay with CTA */}
                  <div className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-all duration-300 ${hoveredId === template.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button className="px-6 py-2.5 bg-white text-slate-900 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-brand-400 hover:text-white transition-colors duration-200 transform hover:scale-105">
                      <Eye className="h-4 w-4" />
                      Lihat Demo
                    </button>
                    <button className="px-6 py-2.5 bg-brand-600 text-white rounded-full font-semibold text-sm hover:bg-brand-500 transition-colors duration-200 transform hover:scale-105">
                      Guna Template
                    </button>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full ${badgeColor} shadow-lg`}>
                      {template.category}
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-brand-400 transition-colors duration-300">
                    {template.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {template.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button className="group relative px-8 py-4 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/25">
            {/* Button gradient background */}
            <div className="absolute inset-0 bg-linear-to-r from-brand-600 via-brand-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 border border-brand-500 rounded-full group-hover:border-transparent transition-colors duration-300"></div>
            <span className="relative z-10 flex items-center gap-2 text-brand-400 group-hover:text-white transition-colors duration-300">
              <Sparkles className="h-4 w-4" />
              Lihat Semua Templat
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
