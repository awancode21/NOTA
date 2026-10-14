import React from 'react';
import { Wallet as WalletType } from '../types/finance';
import { formatRupiah } from '../utils/formatters';
import { Plus, CreditCard, ChevronRight } from 'lucide-react';

interface VisualWalletsCarouselProps {
  wallets: WalletType[];
  selectedWalletId: string | null;
  onSelectWallet: (walletId: string | null) => void;
  isPrivate: boolean;
  onAddFunds: (wallet: WalletType) => void;
}

export const VisualWalletsCarousel: React.FC<VisualWalletsCarouselProps> = ({
  wallets,
  selectedWalletId,
  onSelectWallet,
  isPrivate,
  onAddFunds,
}) => {
  return (
    <div className="py-2.5">
      {/* Title & Filter Indicator */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Kantong & Rekening Saya
          </h2>
        </div>

        {selectedWalletId ? (
          <button
            onClick={() => onSelectWallet(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
          >
            Tampilkan Semua
          </button>
        ) : (
          <span className="text-xs text-slate-400 font-medium">
            {wallets.length} Kantong Aktif
          </span>
        )}
      </div>

      {/* Horizontal Snap Scroll Container */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory no-scrollbar">
        {wallets.map((wallet) => {
          const isSelected = selectedWalletId === wallet.id;

          return (
            <div
              key={wallet.id}
              onClick={() => onSelectWallet(isSelected ? null : wallet.id)}
              className={`relative shrink-0 w-[180px] sm:w-[200px] h-[116px] rounded-2xl bg-gradient-to-br ${wallet.gradient} p-3.5 text-white shadow-md snap-start cursor-pointer transition-all duration-200 active:scale-95 flex flex-col justify-between overflow-hidden border ${
                isSelected
                  ? 'ring-3 ring-emerald-400 ring-offset-2 ring-offset-white scale-[1.02]'
                  : 'border-white/10 hover:shadow-lg'
              }`}
            >
              {/* Subtle ambient light inside card */}
              <div className="pointer-events-none absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10 blur-lg" />

              {/* Card Header: Brand Logo & Type */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {wallet.logoText}
                </span>

                <span className="text-[10px] text-white/70 font-mono">
                  {wallet.accountNumber}
                </span>
              </div>

              {/* Card Middle: Name */}
              <div>
                <p className="text-xs font-medium text-white/80 truncate">
                  {wallet.name}
                </p>
                <p className="text-sm sm:text-base font-bold font-mono tabular-nums text-white tracking-tight mt-0.5">
                  {formatRupiah(wallet.balance, isPrivate)}
                </p>
              </div>

              {/* Card Footer: Quick Top-Up / Status */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-[10px] text-white/70 font-medium">
                  {isSelected ? '✓ Terpilih' : 'Ketuk filter'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFunds(wallet);
                  }}
                  title="Tambah / Sesuaikan Dana"
                  className="flex items-center gap-0.5 text-[10px] font-semibold text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded-md transition-colors"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Isi</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Info card at end */}
        <div className="shrink-0 w-24 h-[116px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-2 text-center text-xs snap-start hover:border-slate-300 transition-colors">
          <CreditCard className="w-5 h-5 mb-1 text-slate-400" />
          <span className="text-[11px] font-medium leading-tight text-slate-500">
            Geser Kartu
          </span>
          <ChevronRight className="w-3.5 h-3.5 mt-1 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
