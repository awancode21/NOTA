import React, { useState } from 'react';
import { Transaction, Wallet, CategoryId } from '../types/finance';
import { CATEGORIES } from '../data/mockData';
import { formatRupiah, formatRelativeDate } from '../utils/formatters';
import {
  BookOpen,
  Receipt,
  ShoppingCart,
  Coffee,
  Car,
  Lightbulb,
  Film,
  Wallet as WalletIcon,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

interface CashbookSectionProps {
  transactions: Transaction[];
  wallets: Wallet[];
  selectedWalletId: string | null;
  onSelectTransaction: (tx: Transaction) => void;
  isPrivate: boolean;
  onOpenAddModal: () => void;
}

export const CashbookSection: React.FC<CashbookSectionProps> = ({
  transactions,
  wallets,
  selectedWalletId,
  onSelectTransaction,
  isPrivate,
  onOpenAddModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('semua');

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    // Wallet filter
    if (selectedWalletId && tx.walletId !== selectedWalletId) {
      return false;
    }
    // Category filter
    if (activeCategory !== 'semua' && tx.category !== activeCategory) {
      return false;
    }
    return true;
  });

  const getCategoryIcon = (category: CategoryId) => {
    switch (category) {
      case 'dapur':
        return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case 'makan':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'transport':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'tagihan':
        return <Lightbulb className="w-4 h-4 text-indigo-600" />;
      case 'hiburan':
        return <Film className="w-4 h-4 text-purple-600" />;
      case 'gaji':
        return <WalletIcon className="w-4 h-4 text-emerald-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryBg = (category: CategoryId) => {
    switch (category) {
      case 'dapur':
        return 'bg-emerald-50 border-emerald-100';
      case 'makan':
        return 'bg-amber-50 border-amber-100';
      case 'transport':
        return 'bg-blue-50 border-blue-100';
      case 'tagihan':
        return 'bg-indigo-50 border-indigo-100';
      case 'hiburan':
        return 'bg-purple-50 border-purple-100';
      case 'gaji':
        return 'bg-emerald-100/70 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="px-4 py-2 mb-16">
      {/* Title & Total Count */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Buku Kas Transaksi
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {filteredTransactions.length} Catatan
        </span>
      </div>

      {/* Quick Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Transaction List Items */}
      <div className="mt-2 space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-white">
            <p className="text-sm font-semibold text-slate-700">Belum ada transaksi</p>
            <p className="text-xs text-slate-400 mt-1">
              Catat pengeluaran baru atau sesuaikan filter Anda.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Catat Sekarang</span>
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const wallet = wallets.find((w) => w.id === tx.walletId);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-100 shadow-2xs hover:shadow-sm cursor-pointer transition-all duration-150 active:scale-[0.99]"
              >
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${getCategoryBg(
                      tx.category
                    )}`}
                  >
                    {getCategoryIcon(tx.category)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {tx.title}
                      </p>
                      {tx.receiptItems && tx.receiptItems.length > 0 && (
                        <span
                          title={`${tx.receiptItems.length} item nota`}
                          className="shrink-0 flex items-center gap-0.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
                        >
                          <Receipt className="w-2.5 h-2.5" />
                          <span>Nota</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata line: Relative Date & Wallet */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-600">
                        {formatRelativeDate(tx.date)}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">
                        {wallet?.name || tx.walletId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Nominal Amount */}
                <div className="text-right shrink-0 pl-2">
                  <p
                    className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${
                      isIncome ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatRupiah(tx.amount, isPrivate)}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {tx.category}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
