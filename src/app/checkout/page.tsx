'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, User, Mail, Phone, ShoppingBag, Palette, ArrowRight, Loader2, Check } from 'lucide-react';
import { TEMPLATES, PRICING } from '@/lib/constants';

type PlanType = 'free' | 'pro' | 'enterprise';

interface FormData {
  fullName: string;
  email: string;
  whatsapp: string;
  storeName: string;
  templateKey: string;
  planType: PlanType;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    whatsapp: '',
    storeName: '',
    templateKey: '',
    planType: 'free',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      newErrors.fullName = 'Nama mesti sekurang-kurangnya 2 aksara';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email tidak sah';
    }
    if (!formData.whatsapp.trim() || formData.whatsapp.length < 10) {
      newErrors.whatsapp = 'Nombor WhatsApp tidak sah';
    }
    if (!formData.storeName.trim() || formData.storeName.length < 2) {
      newErrors.storeName = 'Nama kedai mesti sekurang-kurangnya 2 aksara';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.templateKey) {
      newErrors.templateKey = 'Sila pilih templat';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        if (data.paymentUrl) {
          // Redirect to payment or store
          window.location.href = data.paymentUrl;
        } else {
          router.push(`/thankyou?order=${data.orderNumber}`);
        }
      } else {
        setErrors({ submit: data.error || 'Gagal membuat pesanan' });
      }
    } catch (error) {
      setErrors({ submit: 'Ralat rangkaian. Sila cuba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlan = PRICING.find(p => p.name.toLowerCase() === formData.planType);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center space-x-2 mb-6">
            <Store className="h-8 w-8 text-brand-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              KEDAI
            </span>
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Bina Kedai Anda
          </h1>
          <p className="text-slate-400">
            Lengkapkan maklumat di bawah untuk memulakan
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  step >= s
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded ${
                    step > s ? 'bg-brand-600' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-brand-400" />
                Maklumat Peribadi
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nama Penuh
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${
                    errors.fullName ? 'border-red-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors`}
                  placeholder="Contoh: Ahmad bin Ali"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${
                    errors.email ? 'border-red-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors`}
                  placeholder="contoh@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Nombor WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => updateFormData('whatsapp', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${
                    errors.whatsapp ? 'border-red-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors`}
                  placeholder="0123456789"
                />
                {errors.whatsapp && (
                  <p className="text-red-400 text-sm mt-1">{errors.whatsapp}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <ShoppingBag className="h-4 w-4 inline mr-1" />
                  Nama Kedai
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => updateFormData('storeName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${
                    errors.storeName ? 'border-red-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors`}
                  placeholder="Contoh: Butik Seri Ayu"
                />
                {errors.storeName && (
                  <p className="text-red-400 text-sm mt-1">{errors.storeName}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Palette className="h-5 w-5 mr-2 text-brand-400" />
                Pilih Templat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => updateFormData('templateKey', template.name.toLowerCase().replace(/\s+/g, '-'))}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      formData.templateKey === template.name.toLowerCase().replace(/\s+/g, '-')
                        ? 'border-brand-500 ring-2 ring-brand-500/30'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs bg-brand-600/80 text-white px-2 py-1 rounded-full">
                        {template.category}
                      </span>
                      <h3 className="text-white font-medium mt-2">{template.name}</h3>
                    </div>
                    {formData.templateKey === template.name.toLowerCase().replace(/\s+/g, '-') && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {errors.templateKey && (
                <p className="text-red-400 text-sm">{errors.templateKey}</p>
              )}
            </div>
          )}

          {/* Step 3: Plan Selection */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-white">Pilih Pelan</h2>

              <div className="space-y-4">
                {PRICING.map((plan) => (
                  <div
                    key={plan.name}
                    onClick={() => updateFormData('planType', plan.name.toLowerCase() as PlanType)}
                    className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${
                      formData.planType === plan.name.toLowerCase()
                        ? 'border-brand-500 bg-brand-600/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{plan.name}</h3>
                        <p className="text-slate-400 text-sm">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">{plan.price}</span>
                        <span className="text-slate-400">{plan.period}</span>
                      </div>
                    </div>
                    {plan.highlight && (
                      <span className="absolute -top-2 right-4 bg-brand-600 text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    {formData.planType === plan.name.toLowerCase() && (
                      <div className="absolute top-4 left-4 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h3 className="text-white font-semibold mb-3">Ringkasan Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Nama Kedai</span>
                    <span className="text-white">{formData.storeName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Templat</span>
                    <span className="text-white capitalize">{formData.templateKey.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Pelan</span>
                    <span className="text-white capitalize">{formData.planType}</span>
                  </div>
                  <div className="border-t border-slate-700 my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Jumlah</span>
                    <span className="text-brand-400">{selectedPlan?.price || 'RM 0'}</span>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <p className="text-red-400 text-sm text-center">{errors.submit}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-full border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
              >
                Kembali
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors flex items-center"
              >
                Seterusnya
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    {selectedPlan?.price === 'RM 0' ? 'Bina Kedai Sekarang' : 'Teruskan ke Pembayaran'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
