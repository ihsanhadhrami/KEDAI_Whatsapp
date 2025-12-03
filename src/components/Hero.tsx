'use client';

import { ArrowRight, Play, MessageCircle, ShoppingBag } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/50 via-slate-950 to-slate-950"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm text-slate-300">Platform #1 di Malaysia</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">Bina Kedai Online</span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
                Tanpa Kod
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Cipta kedai online profesional dalam masa 5 minit. Terima pesanan melalui WhatsApp dengan mudah.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">10K+</div>
                <div className="text-slate-400 text-sm">Kedai Aktif</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">50K+</div>
                <div className="text-slate-400 text-sm">Pesanan/Bulan</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">99%</div>
                <div className="text-slate-400 text-sm">Kepuasan</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="hidden lg:flex justify-center items-center relative animate-fade-in-up mt-8" style={{ animationDelay: '0.5s' }}>
            {/* Phone Frame */}
            <div className="relative z-20">
              <div className="w-[260px] h-[520px] bg-slate-900 rounded-[2.5rem] border-4 border-slate-700 shadow-2xl shadow-brand-500/20 overflow-hidden">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-2xl z-10"></div>
                
                {/* Phone Screen Content */}
                <div className="h-full bg-gradient-to-b from-slate-800 to-slate-900 p-3 pt-8">
                  {/* Store Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-xs">Butik Seri Ayu</div>
                      <div className="text-slate-400 text-[10px]">Online Store</div>
                    </div>
                  </div>

                  {/* Product Cards */}
                  <div className="space-y-2">
                    <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/50">
                      <div className="w-full h-20 bg-gradient-to-br from-brand-600/40 to-brand-800/40 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-2xl">👗</span>
                      </div>
                      <div className="text-white text-xs font-medium">Baju Kurung Moden</div>
                      <div className="text-brand-400 text-xs font-bold">RM 89.00</div>
                    </div>
                    
                    <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/50">
                      <div className="w-full h-20 bg-gradient-to-br from-pink-600/40 to-pink-800/40 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-2xl">👜</span>
                      </div>
                      <div className="text-white text-xs font-medium">Handbag Premium</div>
                      <div className="text-brand-400 text-xs font-bold">RM 159.00</div>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <div className="absolute bottom-4 left-3 right-3">
                    <div className="bg-green-500 text-white rounded-full py-2.5 px-3 flex items-center justify-center gap-2 font-medium text-xs">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Order via WhatsApp
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Glow Effect */}
              <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full -z-10 scale-150"></div>
            </div>

            {/* Floating Decor Elements */}
            <div className="absolute -right-4 top-1/4 p-4 glass-card rounded-2xl animate-float z-30 max-w-[200px]" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <MessageCircle size={20} className="text-green-500" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Order Masuk!</div>
                  <div className="text-xs text-slate-400">Ali baru sahaja membeli.</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -left-8 bottom-1/4 p-4 glass-card rounded-2xl animate-float z-10 max-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="bg-brand-500/20 p-2 rounded-lg">
                  <ShoppingBag size={20} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Jualan Hari Ini</div>
                  <div className="text-xs text-brand-300 font-mono">RM 1,240.00</div>
                </div>
              </div>
            </div>
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
