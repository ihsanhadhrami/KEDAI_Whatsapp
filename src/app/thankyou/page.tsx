'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Store, CheckCircle, ExternalLink, Copy, MessageCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface OrderDetails {
  orderNumber: string;
  storeName: string;
  storeSlug: string;
  status: string;
  planType: string;
}

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      // Fetch order details
      fetchOrderDetails();
    } else {
      setIsLoading(false);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      // For now, use mock data - replace with actual API call
      // const response = await fetch(`/api/orders/${orderNumber}`);
      // const data = await response.json();
      
      // Mock data for demo
      setTimeout(() => {
        setOrder({
          orderNumber: orderNumber || 'KD-20251203-XXXXX',
          storeName: 'Kedai Demo',
          storeSlug: 'kedai-demo-abc123',
          status: 'completed',
          planType: 'free',
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const storeUrl = order ? `${window.location.origin}/${order.storeSlug}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = `Jom tengok kedai online saya! 🛍️\n\n${order?.storeName}\n${storeUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-brand-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Memuat maklumat pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Pesanan Tidak Ditemui</h1>
          <p className="text-slate-400 mb-6">Sila pastikan anda menggunakan link yang betul.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <Store className="h-8 w-8 text-brand-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              KEDAI
            </span>
          </Link>
        </div>

        {/* Success Card */}
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Tahniah! 🎉
          </h1>
          <p className="text-slate-400 mb-6">
            Kedai online anda telah berjaya dicipta!
          </p>

          {/* Order Details */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">No. Pesanan</span>
                <span className="text-white font-mono">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Kedai</span>
                <span className="text-white">{order.storeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pelan</span>
                <span className="text-white capitalize">{order.planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-green-400 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Store URL */}
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-2">Link kedai anda:</p>
            <div className="flex items-center bg-slate-800 rounded-xl p-3">
              <span className="text-brand-400 text-sm truncate flex-1">{storeUrl}</span>
              <button
                onClick={copyToClipboard}
                className="ml-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Salin link"
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Copy className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href={`/${order.storeSlug}`}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat Kedai Anda
            </Link>

            <button
              onClick={shareToWhatsApp}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full border border-green-500 text-green-400 hover:bg-green-500/10 font-medium transition-colors"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Kongsi di WhatsApp
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 glass-card rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">💡 Tips Seterusnya</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start">
              <span className="text-brand-400 mr-2">1.</span>
              Tambah produk anda dari dashboard admin
            </li>
            <li className="flex items-start">
              <span className="text-brand-400 mr-2">2.</span>
              Kongsi link kedai di media sosial anda
            </li>
            <li className="flex items-start">
              <span className="text-brand-400 mr-2">3.</span>
              Mula terima pesanan melalui WhatsApp!
            </li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
