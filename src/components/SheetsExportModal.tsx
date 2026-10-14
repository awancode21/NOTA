import React, { useState, useEffect } from 'react';
import { Transaction, Wallet } from '../types/finance';
import { formatRupiah, formatRelativeDate } from '../utils/formatters';
import {
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  initAuth,
} from '../services/googleAuth';
import {
  createFinanceSpreadsheet,
  syncAllTransactionsToSheet,
  listAppSpreadsheets,
  RemoteSpreadsheet,
} from '../services/googleSheets';
import { User } from 'firebase/auth';
import {
  X,
  FileSpreadsheet,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  Plus,
  CloudCheck,
  LogOut,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface SheetsExportModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  wallets: Wallet[];
  onClose: () => void;
  isPrivate: boolean;
}

const STORAGE_KEY_LAST_SPREADSHEET = 'dompet_ramah_last_spreadsheet_v1';

export const SheetsExportModal: React.FC<SheetsExportModalProps> = ({
  isOpen,
  transactions,
  wallets,
  onClose,
  isPrivate,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [activeSheetUrl, setActiveSheetUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LAST_SPREADSHEET);
    } catch {
      return null;
    }
  });
  const [existingSheets, setExistingSheets] = useState<RemoteSpreadsheet[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);

  // Fallback clipboard state
  const [copied, setCopied] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        loadUserSheets(token);
      },
      () => {
        // Not logged in or token needs refresh
        getAccessToken().then((t) => {
          if (t) setAccessToken(t);
        });
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isOpen]);

  const loadUserSheets = async (token: string) => {
    setIsLoadingSheets(true);
    try {
      const sheets = await listAppSpreadsheets(token);
      setExistingSheets(sheets);
    } catch (err) {
      console.warn('Gagal memuat list sheets:', err);
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        loadUserSheets(result.accessToken);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setAuthError(error.message || 'Gagal masuk dengan Google. Pastikan popup tidak diblokir.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setAccessToken(null);
    setExistingSheets([]);
  };

  // Sync to Brand New Sheet
  const handleSyncToNewSheet = async () => {
    if (!accessToken) {
      await handleGoogleSignIn();
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin membuat Google Sheet baru dan menyinkronkan ${transactions.length} catatan transaksi?`
    );
    if (!confirmed) return;

    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccessMsg(null);

    try {
      const { spreadsheetId, spreadsheetUrl } = await createFinanceSpreadsheet(accessToken);
      const { updatedRows } = await syncAllTransactionsToSheet(
        accessToken,
        spreadsheetId,
        transactions,
        wallets
      );

      setActiveSheetUrl(spreadsheetUrl);
      try {
        localStorage.setItem(STORAGE_KEY_LAST_SPREADSHEET, spreadsheetUrl);
      } catch {
        // ignore
      }

      setSyncSuccessMsg(`Berhasil membuat Sheet baru dan menyinkronkan ${updatedRows} transaksi! 🎉`);
      loadUserSheets(accessToken);
    } catch (err: unknown) {
      const error = err as Error;
      setSyncError(error.message || 'Gagal menyinkronkan ke Google Sheets.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync to Existing Sheet
  const handleSyncToExistingSheet = async (sheetId: string, sheetTitle: string) => {
    if (!accessToken) return;

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin memperbarui isi Google Sheet "${sheetTitle}" dengan ${transactions.length} catatan transaksi saat ini? Data sebelumnya di tab Transaksi Kas akan diperbarui.`
    );
    if (!confirmed) return;

    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccessMsg(null);

    try {
      const { updatedRows } = await syncAllTransactionsToSheet(
        accessToken,
        sheetId,
        transactions,
        wallets
      );

      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
      setActiveSheetUrl(url);
      try {
        localStorage.setItem(STORAGE_KEY_LAST_SPREADSHEET, url);
      } catch {
        // ignore
      }

      setSyncSuccessMsg(`Berhasil memperbarui ${updatedRows} transaksi di "${sheetTitle}"! ✨`);
    } catch (err: unknown) {
      const error = err as Error;
      setSyncError(error.message || 'Gagal menyinkronkan ke sheet tersebut.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Clipboard & CSV fallbacks
  const handleCopyForSheets = () => {
    const headers = ['Tanggal', 'Keterangan Transaksi', 'Kategori', 'Sumber Kantong', 'Tipe', 'Nominal (Rp)', 'Catatan'];
    const rows = transactions.map((t) => {
      const wallet = wallets.find((w) => w.id === t.walletId)?.name || t.walletId;
      return [
        new Date(t.date).toLocaleDateString('id-ID'),
        `"${t.title.replace(/"/g, '""')}"`,
        t.category,
        wallet,
        t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        t.amount,
        `"${(t.notes || '').replace(/"/g, '""')}"`,
      ].join('\t');
    });

    const tsvContent = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(tsvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = ['Tanggal', 'Keterangan', 'Kategori', 'Kantong', 'Tipe', 'Nominal', 'Catatan'];
    const rows = transactions.map((t) => {
      const wallet = wallets.find((w) => w.id === t.walletId)?.name || t.walletId;
      return [
        new Date(t.date).toLocaleDateString('id-ID'),
        `"${t.title.replace(/"/g, '""')}"`,
        t.category,
        `"${wallet}"`,
        t.type,
        t.amount,
        `"${(t.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Buku_Kas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="relative w-full max-w-xl rounded-t-[32px] sm:rounded-3xl bg-white p-6 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Sinkronisasi Google Sheets 📗
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan akun Google untuk sinkronisasi otomatis ke lembar kerja.
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

        {/* Google Account Connection Status Card */}
        <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
          {currentUser && accessToken ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {currentUser.displayName || 'Akun Google Terhubung'}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                      ✓ Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Keluar dari Akun Google"
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Belum Terhubung ke Google Workspace
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Masuk dengan akun Google untuk sinkronisasi otomatis langsung ke Google Drive & Sheets Anda.
                </p>
              </div>

              {/* Official Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="shrink-0 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isAuthenticating ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            </div>
          )}
        </div>

        {authError && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{authError}</span>
          </div>
        )}

        {/* Sync Success or Error Banner */}
        {syncSuccessMsg && (
          <div className="mt-3 flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
            <div className="flex items-center gap-2">
              <CloudCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{syncSuccessMsg}</span>
            </div>
            {activeSheetUrl && (
              <a
                href={activeSheetUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center gap-1 font-bold text-emerald-800 underline hover:text-emerald-950 ml-2"
              >
                <span>Buka</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {syncError && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{syncError}</span>
          </div>
        )}

        {/* Primary Cloud Actions */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Aksi Sinkronisasi Cloud Google Sheets
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {transactions.length} Transaksi Siap
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Create New Sheet & Sync */}
            <button
              onClick={handleSyncToNewSheet}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-800 hover:to-emerald-900 text-white font-bold text-xs shadow-md shadow-teal-800/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang Menyinkronkan...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ Buat & Sync ke Sheet Baru</span>
                </>
              )}
            </button>

            {/* If has active spreadsheet */}
            {activeSheetUrl ? (
              <a
                href={activeSheetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer text-center"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                <span>Buka Lembar Terakhir di Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            ) : (
              <div className="flex items-center justify-center p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs text-center font-medium">
                Belum ada spreadsheet tersimpan
              </div>
            )}
          </div>

          {/* List Existing Spreadsheets if logged in */}
          {currentUser && existingSheets.length > 0 && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700">
                  Pilih Spreadsheet Tersedia di Google Drive Anda:
                </span>
                <button
                  onClick={() => loadUserSheets(accessToken!)}
                  className="text-[10px] text-teal-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Muat Ulang</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {existingSheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-100 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">
                        {sheet.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSyncToExistingSheet(sheet.id, sheet.name)}
                      disabled={isSyncing}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Sync ke Sheet Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span className="bg-white px-2">Atau Gunakan Salin & Unduh Cepat</span>
          </div>
        </div>

        {/* Quick Offline Fallbacks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleCopyForSheets}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Data Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Format Tabular</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File CSV (.csv)</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-4">
          Integrasi ini menggunakan Google Sheets API resmi untuk menyinkronkan data keuangan Anda secara aman dan privat.
        </p>
      </div>
    </div>
  );
};
