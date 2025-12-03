'use client';

import { TEMPLATES } from '@/lib/constants';

export default function Templates() {
  return (
    <section id="templates" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Templat <span className="text-brand-400">Premium</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pilih dari koleksi templat profesional yang direka untuk pelbagai industri.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-2xl glass-card"
            >
              {/* Template Image */}
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Template Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 bg-brand-600/80 text-white text-xs rounded-full mb-2">
                  {template.category}
                </span>
                <h3 className="text-xl font-semibold text-white">{template.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-full border border-brand-500 text-brand-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-300 font-medium">
            Lihat Semua Templat
          </button>
        </div>
      </div>
    </section>
  );
}
