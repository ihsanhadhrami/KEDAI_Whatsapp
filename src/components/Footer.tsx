'use client';

import { Store, MessageCircle, Mail, MapPin } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-slate-950"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center mb-16 bg-gradient-to-r from-brand-900/30 to-brand-950/30">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sedia untuk Memulakan?
          </h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Sertai ribuan peniaga yang telah menggunakan KEDAI untuk mengembangkan perniagaan mereka.
          </p>
          <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/30">
            Daftar Percuma Sekarang
          </button>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-8 w-8 text-brand-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                KEDAI
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Platform e-commerce #1 di Malaysia untuk MSME.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Pautan Pantas</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-brand-400 text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Undang-undang</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Terma Perkhidmatan
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Polisi Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Polisi Bayaran Balik
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-400 text-sm">
                <Mail className="h-4 w-4 mr-2 text-brand-400" />
                hello@kedai.my
              </li>
              <li className="flex items-center text-slate-400 text-sm">
                <MessageCircle className="h-4 w-4 mr-2 text-brand-400" />
                +60 12-345 6789
              </li>
              <li className="flex items-start text-slate-400 text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-brand-400 flex-shrink-0" />
                Kuala Lumpur, Malaysia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © {currentYear} KEDAI. Hak cipta terpelihara.
          </p>
        </div>
      </div>
    </footer>
  );
}
