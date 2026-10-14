import React from 'react';
import { TrendingDown, TrendingUp, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface WarmEmeraldCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  isPrivate: boolean;
  savingsRatio?: number;
}

export const WarmEmeraldCard: React.FC<WarmEmeraldCardProps> = ({
  totalBalance,
  totalIncome,
  totalExpense,
  isPrivate,
  savingsRatio = 55,
}) => {
  return (
    <div className="px-4 py-2">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 p-6 text-white shadow-xl shadow-emerald-900/20 border border-emerald-400/20">
        {/* Subtle decorative circles & metallic watermark patterns */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-10 h-36 w-36 rounded-full bg-teal-300/10 blur-xl" />
        
        {/* Decorative card chip pattern */}
        <div className="absolute right-6 top-6 flex items-center gap-1.5 opacity-80">
          <div className="w-8 h-6 rounded-md border border-emerald-200/40 bg-emerald-300/10 backdrop-blur-xs flex items-center justify-center">
            <div className="w-4 h-3 border border-emerald-200/40 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
              <div className="bg-emerald-200/40 rounded-2xs"></div>
              <div className="bg-emerald-200/40 rounded-2xs"></div>
              <div className="bg-emerald-200/40 rounded-2xs"></div>
              <div className="bg-emerald-200/40 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Header Label & Security indicator */}
        <div className="flex items-center gap-1.5 text-emerald-100/90 text-xs font-medium tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Total Saldo Tergabung</span>
        </div>

        {/* Primary Amount */}
        <div className="mt-2 flex items-baseline gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-white drop-shadow-xs">
            {formatRupiah(totalBalance, isPrivate)}
          </h1>
        </div>

        {/* Financial Health Indicator: friendly pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 backdrop-blur-md border border-emerald-400/30 px-3 py-1 text-xs text-emerald-100 font-medium shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Rasio Tabungan: {savingsRatio}% · Sangat Sehat 🎯</span>
        </div>

        {/* Semi-transparent Sub-Metrics for Income & Expense */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {/* Income Box */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-3 transition-colors hover:bg-white/15">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-emerald-100/80">Pemasukan</span>
            </div>
            <p className="mt-1.5 text-sm sm:text-base font-bold font-mono tabular-nums text-white">
              {formatRupiah(totalIncome, isPrivate)}
            </p>
          </div>

          {/* Expense Box */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-3 transition-colors hover:bg-white/15">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-500/25 text-rose-300">
                <TrendingDown className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-emerald-100/80">Pengeluaran</span>
            </div>
            <p className="mt-1.5 text-sm sm:text-base font-bold font-mono tabular-nums text-white">
              {formatRupiah(totalExpense, isPrivate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
