'use client';

import { useState } from 'react';
import { ArrowRight, Play, MessageCircle, ShoppingBag, Heart, Plus, Minus, X, ChevronLeft } from 'lucide-react';

// Product data
const products = [
  {
    id: 1,
    name: 'Baju Kurung Moden',
    price: 89.00,
    image: '/baju-kurung.jpg',
    gradient: 'from-brand-600/40 to-brand-800/40',
    description: 'Baju kurung moden dengan rekaan eksklusif. Sesuai untuk majlis formal dan kasual.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Biru', 'Merah', 'Hijau'],
  },
  {
    id: 2,
    name: 'Handbag Premium',
    price: 159.00,
    image: '/handbag.jpg',
    gradient: 'from-pink-600/40 to-pink-800/40',
    description: 'Handbag premium berkualiti tinggi. Material kulit PU tahan lama.',
    sizes: ['Standard'],
    colors: ['Hitam', 'Coklat', 'Cream'],
  },
];

export default function Hero() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState<number[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<{product: typeof products[0], qty: number, size: string, color: string}[]>([]);

  const toggleLike = (id: number) => {
    setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addToCart = () => {
    if (selectedProduct && selectedSize && selectedColor) {
      setCartItems(prev => [...prev, { product: selectedProduct, qty: quantity, size: selectedSize, color: selectedColor }]);
      setSelectedProduct(null);
      setQuantity(1);
      setSelectedSize('');
      setSelectedColor('');
    }
  };

  const [whatsappClicked, setWhatsappClicked] = useState(false);

  const handleWhatsAppClick = () => {
    setWhatsappClicked(true);
    setTimeout(() => setWhatsappClicked(false), 200);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-brand-950/50 via-slate-950 to-slate-950"></div>
      
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
              <span className="bg-linear-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
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
                <div className="h-full bg-linear-to-b from-slate-800 to-slate-900 p-3 pt-8 overflow-hidden relative">
                  {/* Main Store View */}
                  <div className={`transition-transform duration-300 ${selectedProduct ? '-translate-x-full' : 'translate-x-0'}`}>
                    {/* Store Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-xs">Butik Seri Ayu</div>
                          <div className="text-slate-400 text-[10px]">Online Store</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowCart(!showCart)}
                        className="relative p-1.5 bg-slate-700/50 rounded-full active:scale-95 transition-transform"
                      >
                        <ShoppingBag className="h-4 w-4 text-white" />
                        {cartItems.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-[8px] text-white flex items-center justify-center">
                            {cartItems.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Cart Dropdown */}
                    {showCart && cartItems.length > 0 && (
                      <div className="absolute top-16 left-3 right-3 bg-slate-800 rounded-xl p-2 z-20 border border-slate-700 shadow-xl">
                        <div className="text-white text-xs font-semibold mb-2">Troli Saya</div>
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] text-slate-300 py-1 border-b border-slate-700/50">
                            <span>{item.product.name} x{item.qty}</span>
                            <span className="text-brand-400">RM {(item.product.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="text-right text-xs text-white font-bold mt-2">
                          Jumlah: RM {cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0).toFixed(2)}
                        </div>
                      </div>
                    )}

                    {/* Product Cards */}
                    <div className="space-y-2">
                      {products.map((product) => (
                        <div 
                          key={product.id}
                          onClick={() => { setSelectedProduct(product); setShowCart(false); }}
                          className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/50 cursor-pointer active:scale-[0.98] transition-all hover:border-brand-500/50"
                        >
                          <div className="relative">
                            <div className="w-full h-20 rounded-lg mb-2 overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                              className="absolute top-1 right-1 p-1 bg-slate-900/60 rounded-full active:scale-90 transition-transform"
                            >
                              <Heart 
                                className={`h-3 w-3 transition-colors ${liked.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                              />
                            </button>
                          </div>
                          <div className="text-white text-xs font-medium">{product.name}</div>
                          <div className="text-brand-400 text-xs font-bold">RM {product.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Detail View */}
                  <div className={`absolute inset-0 bg-linear-to-b from-slate-800 to-slate-900 p-3 pt-8 transition-transform duration-300 ${selectedProduct ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedProduct && (
                      <>
                        {/* Back Button */}
                        <button 
                          onClick={() => { setSelectedProduct(null); setQuantity(1); setSelectedSize(''); setSelectedColor(''); }}
                          className="flex items-center gap-1 text-slate-400 text-xs mb-3 active:text-white transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Kembali
                        </button>

                        {/* Product Image */}
                        <div className="w-full h-28 rounded-xl mb-3 overflow-hidden relative">
                          <img 
                            src={selectedProduct.image} 
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                          <button 
                            onClick={() => toggleLike(selectedProduct.id)}
                            className="absolute top-2 right-2 p-1.5 bg-slate-900/60 rounded-full active:scale-90 transition-transform"
                          >
                            <Heart className={`h-4 w-4 transition-colors ${liked.includes(selectedProduct.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="text-white text-sm font-semibold">{selectedProduct.name}</div>
                        <div className="text-brand-400 text-sm font-bold mb-2">RM {selectedProduct.price.toFixed(2)}</div>
                        <p className="text-slate-400 text-[10px] mb-3 leading-relaxed">{selectedProduct.description}</p>

                        {/* Size Selection */}
                        <div className="mb-2">
                          <div className="text-slate-300 text-[10px] mb-1">Saiz:</div>
                          <div className="flex gap-1 flex-wrap">
                            {selectedProduct.sizes.map(size => (
                              <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-2 py-1 rounded text-[10px] transition-all active:scale-95 ${selectedSize === size ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-3">
                          <div className="text-slate-300 text-[10px] mb-1">Warna:</div>
                          <div className="flex gap-1 flex-wrap">
                            {selectedProduct.colors.map(color => (
                              <button 
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-2 py-1 rounded text-[10px] transition-all active:scale-95 ${selectedColor === color ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-slate-300 text-[10px]">Kuantiti:</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center active:scale-90 transition-transform"
                            >
                              <Minus className="h-3 w-3 text-white" />
                            </button>
                            <span className="text-white text-xs w-6 text-center">{quantity}</span>
                            <button 
                              onClick={() => setQuantity(quantity + 1)}
                              className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center active:scale-90 transition-transform"
                            >
                              <Plus className="h-3 w-3 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button 
                          onClick={addToCart}
                          disabled={!selectedSize || !selectedColor}
                          className={`w-full py-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${selectedSize && selectedColor ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        >
                          Tambah ke Troli - RM {(selectedProduct.price * quantity).toFixed(2)}
                        </button>
                      </>
                    )}
                  </div>

                  {/* WhatsApp Button */}
                  <div className="absolute bottom-4 left-3 right-3">
                    <button 
                      onClick={handleWhatsAppClick}
                      className={`w-full bg-green-500 text-white rounded-full py-2.5 px-3 flex items-center justify-center gap-2 font-medium text-xs transition-all shadow-lg shadow-green-500/30 ${whatsappClicked ? 'scale-95 bg-green-600' : 'active:scale-[0.98] hover:bg-green-600'}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Order via WhatsApp
                    </button>
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
