import React from 'react';
import { Transaction, Wallet } from '../types/finance';
import { formatRupiah, formatRelativeDate } from '../utils/formatters';
import { X, Trash2, Receipt, CreditCard, Calendar, Tag, FileText, Store } from 'lucide-react';

interface BottomDrawerProps {
  transaction: Transaction | null;
  wallets: Wallet[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  isPrivate: boolean;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  transaction,
  wallets,
  isOpen,
  onClose,
  onDelete,
  isPrivate,
}) => {
  if (!isOpen || !transaction) return null;

  const wallet = wallets.find((w) => w.id === transaction.walletId);
  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Bottom Drawer Sheet */}
      <div className="relative w-full max-w-lg rounded-t-[32px] bg-white p-6 shadow-2xl transition-transform duration-300 max-h-[85vh] overflow-y-auto no-scrollbar z-10 border-t border-slate-100">
        {/* Centered Drag Handle */}
        <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-slate-300" />

        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isIncome
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isIncome ? 'Pemasukan Kas' : 'Pengeluaran Kas'}
            </span>
            <h3 className="mt-1.5 text-lg font-bold text-slate-900 leading-snug">
              {transaction.title}
            </h3>
            {transaction.merchant && (
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <Store className="w-3.5 h-3.5" />
                <span>{transaction.merchant}</span>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Large Transaction Amount Highlight */}
        <div className="my-4 rounded-2xl bg-slate-50 p-4 text-center border border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Nominal Transaksi</span>
          <p
            className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums mt-1 ${
              isIncome ? 'text-emerald-700' : 'text-slate-900'
            }`}
          >
            {isIncome ? '+' : '-'}{formatRupiah(transaction.amount, isPrivate)}
          </p>
        </div>

        {/* Transaction Metadata List */}
        <div className="space-y-3 py-2 text-xs">
          {/* Rekening / Kantong */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="flex items-center gap-2 text-slate-500">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Sumber Kantong</span>
            </span>
            <span className="font-semibold text-slate-800">
              {wallet ? `${wallet.name} (${wallet.logoText})` : transaction.walletId}
            </span>
          </div>

          {/* Waktu Transaksi */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Waktu Transaksi</span>
            </span>
            <span className="font-semibold text-slate-800">
              {formatRelativeDate(transaction.date)}
            </span>
          </div>

          {/* Kategori */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="flex items-center gap-2 text-slate-500">
              <Tag className="w-4 h-4 text-slate-400" />
              <span>Kategori</span>
            </span>
            <span className="font-semibold text-slate-800 capitalize">
              {transaction.category}
            </span>
          </div>

          {/* Catatan Tambahan */}
          {transaction.notes && (
            <div className="py-2 border-b border-slate-100">
              <span className="flex items-center gap-2 text-slate-500 mb-1">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Catatan</span>
              </span>
              <p className="rounded-xl bg-slate-50 p-2.5 text-slate-700 leading-relaxed">
                {transaction.notes}
              </p>
            </div>
          )}
        </div>

        {/* Itemized Receipt Breakdown (Rincian Struk) */}
        {transaction.receiptItems && transaction.receiptItems.length > 0 && (
          <div className="mt-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-900">
                Rincian Barang Nota Struk ({transaction.receiptItems.length} Item)
              </span>
            </div>

            <div className="space-y-2">
              {transaction.receiptItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between text-xs py-1 border-b border-amber-200/40 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {item.qty}x
                    </span>
                    <span className="font-medium text-slate-800">{item.name}</span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {formatRupiah(item.price, isPrivate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Button Bar */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Yakin ingin menghapus catatan transaksi ini?')) {
                onDelete(transaction.id);
                onClose();
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold py-3 text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Catatan</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
