import React, { useState } from 'react';
import { Transaction } from '../types/finance';
import { formatRupiah } from '../utils/formatters';
import { X, BarChart3, PieChart, TrendingUp, TrendingDown, Target, Sparkles } from 'lucide-react';

interface ReportsModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  onClose: () => void;
  isPrivate: boolean;
  savingsRatio?: number;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  transactions,
  onClose,
  isPrivate,
  savingsRatio = 55,
}) => {
  const [period, setPeriod] = useState<'thisMonth' | 'lastMonth'>('thisMonth');

  if (!isOpen) return null;

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const netSavings = Math.max(0, totalIncome - totalExpense);

  // Group expenses by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  const categoryNames: Record<string, { name: string; emoji: string; color: string }> = {
    dapur: { name: 'Belanja Dapur', emoji: '🛒', color: 'bg-emerald-500' },
    makan: { name: 'Makan & Kopi', emoji: '☕', color: 'bg-amber-500' },
    transport: { name: 'Transportasi', emoji: '🚗', color: 'bg-blue-500' },
    tagihan: { name: 'Tagihan & Utilitas', emoji: '💡', color: 'bg-indigo-500' },
    hiburan: { name: 'Hiburan', emoji: '🎬', color: 'bg-purple-500' },
    lainnya: { name: 'Lainnya', emoji: '📦', color: 'bg-slate-500' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Laporan & Analisis Finansial 📊
              </h3>
              <p className="text-xs text-slate-500">
                Grafik porsi belanja dan kesehatan tabungan bulanan.
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

        {/* Period Selector */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setPeriod('thisMonth')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              period === 'thisMonth'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Oktober 2026 (Bulan Ini)
          </button>
          <button
            onClick={() => setPeriod('lastMonth')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              period === 'lastMonth'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            September 2026 (Lalu)
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Total Pemasukan</span>
            </div>
            <p className="mt-1 text-base font-bold font-mono text-emerald-950">
              {formatRupiah(totalIncome, isPrivate)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span>Total Pengeluaran</span>
            </div>
            <p className="mt-1 text-base font-bold font-mono text-rose-950">
              {formatRupiah(totalExpense, isPrivate)}
            </p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-200" />
            <div>
              <p className="text-[11px] text-emerald-100">Kesehatan Arus Kas</p>
              <p className="text-xs font-bold">Rasio Tabungan: {savingsRatio}% · Sangat Sehat</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white/20 px-2 py-1 rounded-lg">
            +{formatRupiah(netSavings, isPrivate)}
          </span>
        </div>

        {/* Breakdown by Category */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-900">Distribusi Pos Pengeluaran</h4>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Berdasarkan Total Biaya</span>
          </div>

          <div className="space-y-3">
            {categoryEntries.map(([catKey, amount]) => {
              const meta = categoryNames[catKey] || {
                name: catKey,
                emoji: '🏷️',
                color: 'bg-slate-500',
              };
              const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;

              return (
                <div key={catKey} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <span>{meta.emoji}</span>
                      <span>{meta.name}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">{percentage}%</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatRupiah(amount, isPrivate)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Financial Insight Recommendation */}
        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Rangkuman Evaluasi Finansial</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            Arus kasmu berada di zona hijau yang sangat aman. Kamu menyisihkan lebih dari separuh penghasilanmu untuk dana darurat dan investasi masa depan. Pertahankan konsistensi ini! 🌟
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup Laporan
          </button>
        </div>
      </div>
    </div>
  );
};
