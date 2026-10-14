import React, { useState } from 'react';
import { Wallet } from '../types/finance';
import { formatRupiah } from '../utils/formatters';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';

interface AddFundsModalProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAddFunds: (walletId: string, amount: number, note: string) => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  wallet,
  isOpen,
  onClose,
  onConfirmAddFunds,
}) => {
  const [amountStr, setAmountStr] = useState('200000');
  const [note, setNote] = useState('Isi saldo / Top-up kantong');

  if (!isOpen || !wallet) return null;

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr.replace(/\D/g, ''), 10);
    if (!amount || isNaN(amount)) {
      alert('Masukkan nominal yang valid.');
      return;
    }
    onConfirmAddFunds(wallet.id, amount, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Isi Saldo {wallet.name}
            </h3>
            <p className="text-xs text-slate-500">
              Saldo saat ini: {formatRupiah(wallet.balance)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal Isi Saldo (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 font-mono text-base font-bold text-slate-900 outline-hidden"
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1.5">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountStr(amt.toString())}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                +Rp {amt.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs text-slate-900 outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Konfirmasi Tambah Saldo</span>
          </button>
        </form>
      </div>
    </div>
  );
};
