'use client';

import { useState } from 'react';
import { Menu, X, Store } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-brand-400" />
            <span className="text-xl font-bold bg-linear-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              KEDAI
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-brand-400 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/25">
              Mula Sekarang
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-brand-400"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-slate-300 hover:text-brand-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 mt-2">
              Mula Sekarang
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
