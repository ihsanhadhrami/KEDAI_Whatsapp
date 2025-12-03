'use client';

import { FEATURES } from '@/lib/constants';

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ciri-ciri <span className="text-brand-400">Hebat</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Semua yang anda perlukan untuk membina dan menguruskan kedai online yang berjaya.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4 group-hover:bg-brand-600/30 transition-colors">
                  <Icon className="h-7 w-7 text-brand-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
