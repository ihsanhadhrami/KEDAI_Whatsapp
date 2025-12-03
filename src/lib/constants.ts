import { Zap, Palette, ShoppingCart, BarChart3, Smartphone, Headphones, Check, X } from 'lucide-react';

export const NAV_LINKS = [
  { href: '#features', label: 'Ciri-ciri' },
  { href: '#templates', label: 'Templat' },
  { href: '#pricing', label: 'Harga' },
  { href: '#faq', label: 'FAQ' },
];

export const FEATURES = [
  {
    icon: Zap,
    title: 'Pantas & Mudah',
    description: 'Bina kedai online anda dalam masa beberapa minit sahaja.',
  },
  {
    icon: Palette,
    title: 'Templat Menarik',
    description: 'Pilih dari pelbagai templat profesional yang boleh dikustomisasi.',
  },
  {
    icon: ShoppingCart,
    title: 'Pengurusan Produk',
    description: 'Tambah, edit, dan uruskan produk anda dengan mudah.',
  },
  {
    icon: BarChart3,
    title: 'Analitik Jualan',
    description: 'Pantau prestasi kedai dan jualan anda secara masa nyata.',
  },
  {
    icon: Smartphone,
    title: 'Mesra Mudah Alih',
    description: 'Kedai anda dioptimumkan untuk semua peranti.',
  },
  {
    icon: Headphones,
    title: 'Sokongan 24/7',
    description: 'Pasukan sokongan kami sentiasa bersedia membantu.',
  },
];

export const TEMPLATES = [
  {
    id: 1,
    name: 'Minimalis Moden',
    image: 'https://placehold.co/600x400/1e1b4b/a78bfa?text=Minimalis',
    category: 'Fesyen',
  },
  {
    id: 2,
    name: 'Butik Elegan',
    image: 'https://placehold.co/600x400/312e81/c4b5fd?text=Elegan',
    category: 'Kecantikan',
  },
  {
    id: 3,
    name: 'Kedai Segar',
    image: 'https://placehold.co/600x400/3730a3/ddd6fe?text=Segar',
    category: 'Makanan',
  },
];

export const PRICING = [
  {
    name: 'Percuma',
    price: 'RM 0',
    period: '/bulan',
    description: 'Untuk pemula',
    features: [
      { text: 'Sehingga 10 produk', included: true },
      { text: 'Templat asas', included: true },
      { text: 'Integrasi WhatsApp', included: true },
      { text: 'Analitik asas', included: false },
      { text: 'Domain kustom', included: false },
    ],
    cta: 'Mula Percuma',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'RM 59',
    period: '/bulan',
    description: 'Untuk perniagaan berkembang',
    features: [
      { text: 'Produk tanpa had', included: true },
      { text: 'Semua templat premium', included: true },
      { text: 'Integrasi WhatsApp', included: true },
      { text: 'Analitik lanjutan', included: true },
      { text: 'Domain kustom', included: true },
    ],
    cta: 'Pilih Pro',
    highlight: true,
  },
  {
    name: 'Enterpris',
    price: 'RM 149',
    period: '/bulan',
    description: 'Untuk perniagaan besar',
    features: [
      { text: 'Semua ciri Pro', included: true },
      { text: 'Sokongan prioriti', included: true },
      { text: 'API akses', included: true },
      { text: 'White-label', included: true },
      { text: 'Akaun pengurus', included: true },
    ],
    cta: 'Hubungi Kami',
    highlight: false,
  },
];

export const FAQS = [
  {
    question: 'Bagaimana cara memulakan kedai?',
    answer: 'Anda boleh memulakan dengan mendaftar akaun percuma. Kemudian, pilih templat yang anda suka, tambah produk anda, dan kedai anda sedia untuk dikongsi!',
  },
  {
    question: 'Adakah saya perlu kemahiran teknikal?',
    answer: 'Tidak sama sekali! Platform kami direka untuk pengguna tanpa latar belakang teknikal. Antara muka seret dan lepas kami menjadikan semuanya mudah.',
  },
  {
    question: 'Bagaimana pelanggan membuat pesanan?',
    answer: 'Pelanggan boleh menyemak produk anda dan klik butang "Order via WhatsApp" yang akan membuka chat WhatsApp dengan maklumat pesanan secara automatik.',
  },
  {
    question: 'Bolehkah saya upgrade atau downgrade pelan?',
    answer: 'Ya, anda boleh menukar pelan anda bila-bila masa. Perubahan akan berkuat kuasa pada kitaran bil seterusnya.',
  },
  {
    question: 'Adakah data saya selamat?',
    answer: 'Keselamatan data adalah keutamaan kami. Kami menggunakan enkripsi SSL dan mengikuti amalan keselamatan terbaik untuk melindungi data anda.',
  },
];
