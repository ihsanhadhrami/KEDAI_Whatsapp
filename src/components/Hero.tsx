'use client';

import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/50 via-slate-950 to-slate-950"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          <span className="text-sm text-slate-300">Platform #1 di Malaysia</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">Bina Kedai Online</span>
          <br />
          <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
            Tanpa Kod
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Cipta kedai online profesional dalam masa 5 minit. Terima pesanan melalui WhatsApp dengan mudah.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button className="group bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/30 flex items-center">
            Mula Percuma
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center px-8 py-4 rounded-full font-semibold text-lg text-slate-300 hover:text-white transition-colors duration-200">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center mr-3 group-hover:bg-brand-600/20 transition-colors">
              <Play className="h-5 w-5 text-brand-400" />
            </div>
            Tonton Demo
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
            <div className="text-slate-400 text-sm">Kedai Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">50K+</div>
            <div className="text-slate-400 text-sm">Pesanan/Bulan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">99%</div>
            <div className="text-slate-400 text-sm">Kepuasan</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
