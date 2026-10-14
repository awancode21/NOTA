import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, RotateCcw, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface SmartphoneFrameProps {
  children: React.ReactNode;
  onResetData: () => void;
}

export const SmartphoneFrame: React.FC<SmartphoneFrameProps> = ({
  children,
  onResetData,
}) => {
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 transition-colors">
      {/* External Desktop Controller Header */}
      <div className="w-full max-w-lg mb-3 px-3 py-2 flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white tracking-tight">
            DompetRamah Mobile
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle Screen Frame Mode */}
          <button
            onClick={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all active:scale-95 cursor-pointer"
            title="Beralih antara Mode Bingkai Ponsel dan Layar Penuh"
          >
            {isPhoneFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Mode HP</span>
              </>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Kembalikan data ke contoh awal?')) {
                onResetData();
              }
            }}
            title="Reset ke Data Awal"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-200 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Container: Either Phone Frame or Full Responsive Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrameMode
            ? 'max-w-[420px] rounded-[44px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-0 sm:border-[8px] sm:border-slate-800 ring-1 ring-slate-700/60 bg-slate-50 overflow-hidden relative'
            : 'max-w-2xl rounded-3xl bg-slate-50 shadow-2xl border border-slate-800 overflow-hidden relative'
        }`}
      >
        {/* Realistic Mobile Status Bar (visible in phone mode or top of container) */}
        <div className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between text-slate-900 text-xs font-semibold select-none">
          <span className="font-mono text-[13px] tracking-tight">{currentTime}</span>

          {/* Dynamic Island Pill Notch */}
          {isPhoneFrameMode && (
            <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-end px-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>
          )}

          {/* Telemetry Status Icons (Cellular, Wifi, Battery) */}
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <BatteryCharging className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Child Screen Body */}
        <div className="min-h-[740px] flex flex-col justify-between">
          <main className="flex-1">{children}</main>

          {/* Bottom Home Indicator Bar */}
          <div className="py-2 flex justify-center bg-white/90">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
