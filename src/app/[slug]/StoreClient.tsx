'use client';

import { useState } from 'react';
import { Store as StoreIcon, ShoppingBag, MessageCircle, X, Plus, Minus, Trash2 } from 'lucide-react';
import type { Store, Product } from '@/models/store';

interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

interface StoreClientProps {
  store: Store;
  products: Product[];
}

export default function StoreClient({ store, products }: StoreClientProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Generate WhatsApp message
  const orderViaWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `Assalamualaikum! Saya ingin membuat pesanan:\n\n`;
    
    cart.forEach(item => {
      message += `• ${item.product.name} x${item.quantity} - RM ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Jumlah: RM ${cartTotal.toFixed(2)}*\n\n`;
    message += `Terima kasih! 🙏`;

    const phone = store.whatsapp.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Theme colors from store
  const theme = store.theme_json || {
    primaryColor: '#8b5cf6',
    backgroundColor: '#020617',
    textColor: '#f8fafc',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}>
                <StoreIcon className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">{store.name}</h1>
              {store.description && (
                <p className="text-sm opacity-70 line-clamp-1">{store.description}</p>
              )}
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-full transition-colors"
            style={{ backgroundColor: `${theme.primaryColor}20` }}
          >
            <ShoppingBag className="h-6 w-6" style={{ color: theme.primaryColor }} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="sticky top-[72px] z-30 glass border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory ? 'text-white' : 'text-white/60 hover:text-white/80'
              }`}
              style={{ backgroundColor: !selectedCategory ? theme.primaryColor : 'transparent' }}
            >
              Semua
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
                style={{ backgroundColor: selectedCategory === category ? theme.primaryColor : 'transparent' }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-60">Tiada produk ditemui</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => {
              const images = product.images_json || [];
              const inCart = cart.find(item => item.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
                  style={{ backgroundColor: `${theme.primaryColor}10` }}
                >
                  {/* Product Image */}
                  <div className="aspect-square relative overflow-hidden">
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <ShoppingBag className="h-12 w-12 opacity-20" />
                      </div>
                    )}

                    {/* Sale Badge */}
                    {product.compare_price && product.compare_price > product.price && (
                      <span
                        className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: '#ef4444' }}
                      >
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold" style={{ color: theme.primaryColor }}>
                        RM {product.price.toFixed(2)}
                      </span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm line-through opacity-50">
                          RM {product.compare_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    {inCart ? (
                      <div className="flex items-center justify-between rounded-full border border-white/20 p-1">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium">{inCart.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 rounded-full font-medium text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        Tambah
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <ShoppingBag className="h-5 w-5" />
            Lihat Troli ({cartCount}) - RM {cartTotal.toFixed(2)}
          </button>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Cart Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 shadow-xl flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold">Troli Anda</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="opacity-60">Troli anda kosong</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-3 p-3 rounded-xl bg-white/5">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                        {item.product.images_json?.[0] ? (
                          <img
                            src={item.product.images_json[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.name}</h4>
                        <p style={{ color: theme.primaryColor }}>
                          RM {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 rounded hover:bg-white/10"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 rounded hover:bg-white/10"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-red-400 ml-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-between mb-4">
                  <span className="opacity-70">Jumlah</span>
                  <span className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                    RM {cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={orderViaWhatsApp}
                  className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="h-5 w-5" />
                  Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10">
        <p className="text-sm opacity-50">
          Powered by{' '}
          <a href="/" className="hover:opacity-80" style={{ color: theme.primaryColor }}>
            KEDAI
          </a>
        </p>
      </footer>
    </div>
  );
}
