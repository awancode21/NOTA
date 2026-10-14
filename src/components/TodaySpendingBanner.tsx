import React from 'react';
import { ShoppingBag, Camera, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface TodaySpendingBannerProps {
  todayExpense: number;
  itemCount: number;
  isPrivate: boolean;
  onOpenScanModal: () => void;
  onViewTodayList: () => void;
}

export const TodaySpendingBanner: React.FC<TodaySpendingBannerProps> = ({
  todayExpense,
  itemCount,
  isPrivate,
  onOpenScanModal,
  onViewTodayList,
}) => {
  const isZero = todayExpense === 0;

  return (
    <div className="px-4 py-1.5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-200/70 p-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <ShoppingBag className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-900/80">
                <span>Belanja Hari Ini</span>
                <span className="text-amber-400">·</span>
                <span className="text-amber-800 font-semibold">
                  {itemCount > 0 ? `${itemCount} Transaksi` : 'Hari Baru'}
                </span>
              </div>

              <div className="mt-0.5 flex items-baseline gap-1.5">
                {isZero ? (
                  <span className="text-sm sm:text-base font-bold text-emerald-700">
                    Belum Ada (Hemat! 🎉)
                  </span>
                ) : (
                  <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-900">
                    {formatRupiah(todayExpense, isPrivate)} {itemCount > 0 ? '☕' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Shortcut Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenScanModal}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>+ Scan Nota</span>
            </button>
            <button
              onClick={onViewTodayList}
              title="Lihat detail hari ini"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 active:scale-95 transition-all"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
