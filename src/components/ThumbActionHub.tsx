import React from 'react';
import { Plus, Camera, Zap, BarChart3, FileSpreadsheet } from 'lucide-react';

interface ThumbActionHubProps {
  onOpenAddModal: () => void;
  onOpenScanModal: () => void;
  onOpenSyncModal: () => void;
  onOpenReportModal: () => void;
  onOpenSheetsModal: () => void;
}

export const ThumbActionHub: React.FC<ThumbActionHubProps> = ({
  onOpenAddModal,
  onOpenScanModal,
  onOpenSyncModal,
  onOpenReportModal,
  onOpenSheetsModal,
}) => {
  const actions = [
    {
      id: 'catat',
      title: 'Catat',
      icon: Plus,
      colorClass: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25',
      badge: 'Baru',
      onClick: onOpenAddModal,
    },
    {
      id: 'scan',
      title: 'Scan',
      icon: Camera,
      colorClass: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25',
      badge: 'Nota',
      onClick: onOpenScanModal,
    },
    {
      id: 'sync',
      title: 'Sync',
      icon: Zap,
      colorClass: 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/25',
      badge: 'Bank',
      onClick: onOpenSyncModal,
    },
    {
      id: 'laporan',
      title: 'Laporan',
      icon: BarChart3,
      colorClass: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25',
      badge: 'Tren',
      onClick: onOpenReportModal,
    },
    {
      id: 'sheets',
      title: 'Sheets',
      icon: FileSpreadsheet,
      colorClass: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25',
      badge: 'Ekspor',
      onClick: onOpenSheetsModal,
    },
  ];

  return (
    <div className="px-4 py-2">
      <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-100">
        <div className="grid grid-cols-5 gap-2">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={act.onClick}
                className="group flex flex-col items-center justify-center p-1 cursor-pointer focus:outline-hidden active:scale-95 transition-transform duration-150"
              >
                {/* Visual Icon Button Circle */}
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-all group-hover:scale-105 ${act.colorClass}`}
                >
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>

                {/* Friendly Caption */}
                <span className="mt-1.5 text-xs font-semibold text-slate-700 group-hover:text-slate-900 tracking-tight">
                  {act.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
