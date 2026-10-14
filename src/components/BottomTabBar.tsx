import React from 'react';
import { ActiveTab } from '../types/finance';
import { Home, ListOrdered, BarChart2, Wallet, Camera } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenScanModal: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  onOpenScanModal,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto relative h-14">
        {/* Tab 1: Beranda */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer transition-colors active:scale-95 ${
            activeTab === 'home' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Beranda</span>
          {activeTab === 'home' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 mt-0.5" />
          )}
        </button>

        {/* Tab 2: Mutasi */}
        <button
          onClick={() => onTabChange('mutasi')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer transition-colors active:scale-95 ${
            activeTab === 'mutasi' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <ListOrdered className={`w-5 h-5 ${activeTab === 'mutasi' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Mutasi</span>
          {activeTab === 'mutasi' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 mt-0.5" />
          )}
        </button>

        {/* Center Floating Action Button: Scan Struk */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={onOpenScanModal}
            title="Scan Nota Struk Belanja"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-500 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-white active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <Camera className="w-6 h-6 stroke-[2.3]" />
          </button>
          <span className="text-[10px] font-bold text-emerald-800 mt-1">Scan Nota</span>
        </div>

        {/* Tab 3: Laporan */}
        <button
          onClick={() => onTabChange('laporan')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer transition-colors active:scale-95 ${
            activeTab === 'laporan' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <BarChart2 className={`w-5 h-5 ${activeTab === 'laporan' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Laporan</span>
          {activeTab === 'laporan' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 mt-0.5" />
          )}
        </button>

        {/* Tab 4: Kantong */}
        <button
          onClick={() => onTabChange('kantong')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-full cursor-pointer transition-colors active:scale-95 ${
            activeTab === 'kantong' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Wallet className={`w-5 h-5 ${activeTab === 'kantong' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Kantong</span>
          {activeTab === 'kantong' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
