import React from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { getGreetingByTime } from '../utils/formatters';

interface HeaderGreetingProps {
  isPrivate: boolean;
  onTogglePrivacy: () => void;
  userInitial?: string;
  userName?: string;
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = ({
  isPrivate,
  onTogglePrivacy,
  userInitial = 'AF',
  userName = 'Asep Fauzi',
}) => {
  const { greeting, icon } = getGreetingByTime();

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-2">
      <div className="flex items-center gap-3">
        {/* Avatar with warm emerald ring */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 p-[2.5px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-emerald-300 font-bold text-sm tracking-wider">
              {userInitial}
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>

        {/* Dynamic Greeting & User Status */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>{greeting} {icon}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-700 font-semibold">{userName}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 text-emerald-600 animate-spin-slow" />
              Kondisi Keuangan Prima ✨
            </span>
          </div>
        </div>
      </div>

      {/* Friendly Privacy Button */}
      <button
        onClick={onTogglePrivacy}
        title={isPrivate ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
        aria-label="Toggle privasi saldo"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 bg-slate-100/90 active:scale-95 transition-all cursor-pointer border border-slate-200/60"
      >
        {isPrivate ? (
          <>
            <EyeOff className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Rahasiakan</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Privasi</span>
          </>
        )}
      </button>
    </div>
  );
};
