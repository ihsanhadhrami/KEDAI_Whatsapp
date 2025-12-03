'use client';

import { Check, X } from 'lucide-react';
import { PRICING } from '@/lib/constants';

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-brand-950/20 to-slate-950"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pelan <span className="text-brand-400">Harga</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pilih pelan yang sesuai dengan keperluan perniagaan anda. Tiada yuran tersembunyi.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-brand-600/20 to-brand-950/20 border-2 border-brand-500 scale-105'
                  : 'glass-card'
              }`}
            >
              {/* Popular Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              {/* Plan Info */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-slate-600 mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-slate-300' : 'text-slate-500'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg hover:shadow-brand-600/25'
                    : 'border border-slate-600 text-slate-300 hover:border-brand-500 hover:text-brand-400'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
