import React, { useState } from 'react';
import { Wallet, Transaction } from '../types/finance';
import { X, Zap, RefreshCw, CheckCircle2, Building2, Smartphone, ArrowRight } from 'lucide-react';

interface BankSyncModalProps {
  isOpen: boolean;
  wallets: Wallet[];
  onClose: () => void;
  onSyncMutations: (newTransactions: Omit<Transaction, 'id'>[]) => void;
}

export const BankSyncModal: React.FC<BankSyncModalProps> = ({
  isOpen,
  wallets,
  onClose,
  onSyncMutations,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncedCount(null);

    setTimeout(() => {
      // Create 2 realistic fresh transactions
      const newItems: Omit<Transaction, 'id'>[] = [
        {
          type: 'expense',
          title: 'QRIS Makan Siang Resto Padang',
          merchant: 'Restoran Garuda Sabang',
          amount: 68000,
          category: 'makan',
          walletId: 'bca',
          date: new Date().toISOString(),
          notes: 'Mutasi otomatis sinkronisasi API perbankan BCA.',
        },
        {
          type: 'expense',
          title: 'Pembelian Paket Data Telkomsel',
          merchant: 'MyTelkomsel GoPay',
          amount: 85000,
          category: 'tagihan',
          walletId: 'gopay',
          date: new Date().toISOString(),
          notes: 'Mutasi otomatis pembayaran autodebit e-wallet.',
        },
      ];

      onSyncMutations(newItems);
      setIsSyncing(false);
      setSyncedCount(newItems.length);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500 text-white shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Tarik Mutasi Bank Otomatis ⚡
              </h3>
              <p className="text-xs text-slate-500">
                Sinkronisasi saldo & mutasi transaksi dari BCA, Mandiri, dan GoPay.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bank Connection List */}
        <div className="mt-4 space-y-2.5">
          {wallets
            .filter((w) => w.type !== 'cash')
            .map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs">
                    {w.type === 'bank' ? (
                      <Building2 className="w-4 h-4 text-purple-300" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-teal-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{w.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {w.accountNumber} · Terhubung API
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif
                </span>
              </div>
            ))}
        </div>

        {/* Sync Status Banner */}
        {syncedCount !== null && (
          <div className="mt-4 flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Sinkronisasi Berhasil!</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {syncedCount} transaksi mutasi terbaru telah ditarik dan dicatat ke buku kas.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menghubungi Server Perbankan...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Tarik Mutasi Terbaru Sekarang</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Enkripsi aman end-to-end dengan standar Open Banking Indonesia.
        </p>
      </div>
    </div>
  );
};
