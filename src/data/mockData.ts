import { CategoryMeta, Transaction, Wallet } from '../types/finance';

export const INITIAL_WALLETS: Wallet[] = [
  {
    id: 'bca',
    name: 'BCA Prioritas',
    type: 'bank',
    accountNumber: '• 8291',
    balance: 18450000,
    gradient: 'from-blue-700 via-blue-800 to-indigo-900',
    badgeColor: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
    logoText: 'BCA',
  },
  {
    id: 'mandiri',
    name: 'Mandiri Payroll',
    type: 'bank',
    accountNumber: '• 4022',
    balance: 12300000,
    gradient: 'from-amber-600 via-sky-900 to-slate-900',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    logoText: 'MANDIRI',
  },
  {
    id: 'gopay',
    name: 'GoPay Jajan',
    type: 'ewallet',
    accountNumber: '0812•••89',
    balance: 685000,
    gradient: 'from-teal-600 via-cyan-700 to-sky-800',
    badgeColor: 'bg-teal-500/20 text-teal-200 border-teal-400/30',
    logoText: 'GOPAY',
  },
  {
    id: 'cash',
    name: 'Kas Tunai Dompet',
    type: 'cash',
    accountNumber: 'Saku Fisik',
    balance: 450000,
    gradient: 'from-emerald-700 via-emerald-800 to-teal-900',
    badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    logoText: 'TUNAI',
  },
];

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'semua',
    name: 'Semua',
    emoji: '✨',
    badgeBg: 'bg-slate-100 text-slate-800',
    badgeText: 'text-slate-800',
  },
  {
    id: 'dapur',
    name: 'Belanja Dapur',
    emoji: '🛒',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    badgeText: 'text-emerald-700',
  },
  {
    id: 'makan',
    name: 'Makan & Kopi',
    emoji: '☕',
    badgeBg: 'bg-amber-100 text-amber-800',
    badgeText: 'text-amber-700',
  },
  {
    id: 'transport',
    name: 'Transport',
    emoji: '🚗',
    badgeBg: 'bg-blue-100 text-blue-800',
    badgeText: 'text-blue-700',
  },
  {
    id: 'tagihan',
    name: 'Tagihan',
    emoji: '💡',
    badgeBg: 'bg-indigo-100 text-indigo-800',
    badgeText: 'text-indigo-700',
  },
  {
    id: 'hiburan',
    name: 'Hiburan',
    emoji: '🎬',
    badgeBg: 'bg-purple-100 text-purple-800',
    badgeText: 'text-purple-700',
  },
  {
    id: 'gaji',
    name: 'Gaji & Bonus',
    emoji: '💰',
    badgeBg: 'bg-emerald-100 text-emerald-900',
    badgeText: 'text-emerald-800',
  },
];

// Helper to make dates relative to today
const now = new Date();
const today0710 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 10).toISOString();
const today1025 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 25).toISOString();

const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const yesterday1420 = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 14, 20).toISOString();
const yesterday1945 = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 19, 45).toISOString();

const threeDaysAgo = new Date(now);
threeDaysAgo.setDate(now.getDate() - 3);
const threeDaysAgo1230 = new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 12, 30).toISOString();

const fiveDaysAgo = new Date(now);
fiveDaysAgo.setDate(now.getDate() - 5);
const fiveDaysAgo0900 = new Date(fiveDaysAgo.getFullYear(), fiveDaysAgo.getMonth(), fiveDaysAgo.getDate(), 9, 0).toISOString();

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'expense',
    title: 'Kopi Susu Aren & Butter Croissant',
    merchant: 'Kopi Kenangan Senopati',
    amount: 52000,
    category: 'makan',
    walletId: 'gopay',
    date: today0710,
    notes: 'Sarapan pagi santai sebelum mulai kerja.',
    receiptItems: [
      { id: 'item-1', name: 'Kopi Kenangan Mantan (Large)', qty: 1, price: 28000 },
      { id: 'item-2', name: 'Butter Croissant Premium', qty: 1, price: 24000 },
    ],
  },
  {
    id: 'tx-002',
    type: 'expense',
    title: 'Beli Buah Segar & Camilan Sehat',
    merchant: 'Superindo Express',
    amount: 86500,
    category: 'dapur',
    walletId: 'cash',
    date: today1025,
    notes: 'Pisang cavendish, apel fuji, dan yogurt.',
    receiptItems: [
      { id: 'item-3', name: 'Pisang Cavendish 1 Sisir', qty: 1, price: 24500 },
      { id: 'item-4', name: 'Apel Fuji RRC 1kg', qty: 1, price: 38000 },
      { id: 'item-5', name: 'Greek Yogurt Plain 400g', qty: 1, price: 24000 },
    ],
  },
  {
    id: 'tx-003',
    type: 'expense',
    title: 'Belanja Dapur & Kebutuhan Rumah',
    merchant: 'Indomaret Fresh Point',
    amount: 185000,
    category: 'dapur',
    walletId: 'bca',
    date: yesterday1420,
    notes: 'Bahan masakan mingguan dan bumbu dapur.',
    receiptItems: [
      { id: 'item-6', name: 'Beras Premium Ramos 5kg', qty: 1, price: 74000 },
      { id: 'item-7', name: 'Minyak Goreng Sania 2L', qty: 1, price: 36000 },
      { id: 'item-8', name: 'Telur Ayam Negeri 1kg', qty: 1, price: 29000 },
      { id: 'item-9', name: 'Daging Ayam Fillet Dada 500g', qty: 1, price: 46000 },
    ],
  },
  {
    id: 'tx-004',
    type: 'expense',
    title: 'Isi Bahan Bakar Pertamax',
    merchant: 'SPBU Pertamina 31.12',
    amount: 150000,
    category: 'transport',
    walletId: 'mandiri',
    date: yesterday1945,
    notes: 'Full tank untuk mobilitas kantor.',
    receiptItems: [
      { id: 'item-10', name: 'Pertamax RON 92 (11.6 L)', qty: 1, price: 150000 },
    ],
  },
  {
    id: 'tx-005',
    type: 'income',
    title: 'Transfer Gaji Pokok & Tunjangan',
    merchant: 'PT Solusi Teknologi Bersama',
    amount: 15000000,
    category: 'gaji',
    walletId: 'mandiri',
    date: threeDaysAgo1230,
    notes: 'Payroll gaji bulan berjalan tepat waktu.',
  },
  {
    id: 'tx-006',
    type: 'expense',
    title: 'Token Listrik PLN & Internet IndiHome',
    merchant: 'PLN Mobile & Telkom',
    amount: 650000,
    category: 'tagihan',
    walletId: 'bca',
    date: fiveDaysAgo0900,
    notes: 'Token listrik 300k + Wifi fiber optic 350k.',
    receiptItems: [
      { id: 'item-11', name: 'Token Listrik Prabayar PLN', qty: 1, price: 300000 },
      { id: 'item-12', name: 'Paket Internet IndiHome 50 Mbps', qty: 1, price: 350000 },
    ],
  },
];
