export type TransactionType = 'expense' | 'income';

export type CategoryId = 'semua' | 'dapur' | 'makan' | 'transport' | 'tagihan' | 'hiburan' | 'gaji' | 'lainnya';

export interface ReceiptItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: CategoryId;
  walletId: string;
  date: string; // ISO string
  notes?: string;
  receiptItems?: ReceiptItem[];
  receiptImage?: string;
  merchant?: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'cash';
  accountNumber?: string;
  balance: number;
  gradient: string;
  badgeColor: string;
  logoText: string;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  emoji: string;
  badgeBg: string;
  badgeText: string;
}

export type ActiveTab = 'home' | 'mutasi' | 'laporan' | 'kantong';
