import React, { useState } from 'react';
import { Lightbulb, RotateCw } from 'lucide-react';

interface SmartTipsCardProps {
  savingsRatio?: number;
}

const TIPS_COLLECTION = [
  'Pola belanjamu sangat baik! Kamu berhasil menyisihkan 55% penghasilan ke tabungan & investasi. Pertahankan ya! 🎯',
  'Membawa bekal kopi atau tumbler air minum sendiri ke kantor bisa hemat hingga Rp 400.000 setiap bulan! ☕💧',
  'Aturan 24 Jam: Tunggu sehari sebelum membeli barang non-esensial di marketplace untuk mencegah belanja impulsif ⏳🛍️',
  'Alokasikan uang kembalian atau sisa budget mingguan ke kantong Kas Tunai agar tersimpan rapi tanpa terasa 🪙✨',
  'Belanja bahan dapur mingguan dengan daftar belanjaan terbukti memangkas pemborosan makanan hingga 30% 🥦🍲',
];

export const SmartTipsCard: React.FC<SmartTipsCardProps> = ({ savingsRatio = 55 }) => {
  const [tipIndex, setTipIndex] = useState(0);

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % TIPS_COLLECTION.length);
  };

  const currentTip =
    tipIndex === 0
      ? `Pola belanjamu sangat baik! Kamu berhasil menyisihkan ${savingsRatio}% penghasilan ke tabungan & investasi. Pertahankan ya! 🎯`
      : TIPS_COLLECTION[tipIndex];

  return (
    <div className="px-4 py-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-cyan-50 border border-emerald-200/60 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 tracking-wide">
                Catatan Cerdas Finansialmu
              </span>
              <button
                onClick={handleNextTip}
                title="Ganti tips hemat"
                className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 cursor-pointer active:scale-95 transition-all"
              >
                <RotateCw className="h-3 w-3" />
                <span>Tips Lain</span>
              </button>
            </div>

            <p className="mt-1 text-xs text-slate-700 leading-relaxed font-normal">
              {currentTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
