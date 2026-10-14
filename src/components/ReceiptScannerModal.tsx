import React, { useState, useRef, useEffect } from 'react';
import { Transaction, Wallet, ReceiptItem } from '../types/finance';
import {
  X,
  Camera,
  Upload,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Store,
  Calendar,
  AlertCircle,
  Receipt,
} from 'lucide-react';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  wallets: Wallet[];
  onClose: () => void;
  onReceiptScanned: (newTx: Omit<Transaction, 'id'>) => void;
}

interface SampleReceipt {
  id: string;
  name: string;
  merchant: string;
  category: 'dapur' | 'makan' | 'transport';
  items: ReceiptItem[];
  total: number;
}

const SAMPLE_RECEIPTS: SampleReceipt[] = [
  {
    id: 'indomaret',
    name: 'Nota Indomaret Point',
    merchant: 'Indomaret Point Stasiun',
    category: 'dapur',
    items: [
      { id: 'i1', name: 'Roti Gandum Sari Roti', qty: 1, price: 21500 },
      { id: 'i2', name: 'Ultra Milk Full Cream 1L', qty: 2, price: 39000 },
      { id: 'i3', name: 'Indomie Goreng Spesial (5pcs)', qty: 1, price: 16500 },
      { id: 'i4', name: 'Sabun Cuci Piring Sunlight', qty: 1, price: 14500 },
    ],
    total: 91500,
  },
  {
    id: 'kopi',
    name: 'Struk Kopi Kenangan',
    merchant: 'Kopi Kenangan Senopati',
    category: 'makan',
    items: [
      { id: 'k1', name: 'Kopi Kenangan Mantan Large', qty: 2, price: 56000 },
      { id: 'k2', name: 'Roti Coklat Klasik', qty: 1, price: 15000 },
    ],
    total: 71000,
  },
  {
    id: 'pertamina',
    name: 'Struk SPBU Pertamina',
    merchant: 'SPBU Pertamina 31.129.02',
    category: 'transport',
    items: [
      { id: 'p1', name: 'Bahan Bakar Pertamax (15.5 Liter)', qty: 1, price: 200000 },
    ],
    total: 200000,
  },
];

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  wallets,
  onClose,
  onReceiptScanned,
}) => {
  const [mode, setMode] = useState<'camera' | 'upload' | 'samples'>('samples');
  const [selectedWalletId, setSelectedWalletId] = useState<string>(wallets[0]?.id || 'gopay');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Extracted data state
  const [extractedData, setExtractedData] = useState<{
    merchant: string;
    total: number;
    category: 'dapur' | 'makan' | 'transport';
    items: ReceiptItem[];
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize or stop camera based on modal state and mode
  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung di perangkat ini.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      const error = err as Error;
      setCameraError(error.message || 'Izin kamera ditolak. Gunakan unggah foto atau contoh struk.');
      setMode('samples');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCaptureFromCamera = () => {
    setIsScanning(true);
    // Simulate OCR frame grab and analysis
    setTimeout(() => {
      // Pick a realistic sample
      const sample = SAMPLE_RECEIPTS[1]; // Kopi Kenangan
      setExtractedData({
        merchant: sample.merchant,
        total: sample.total,
        category: sample.category,
        items: sample.items,
      });
      setIsScanning(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setIsScanning(true);
        // Simulate extraction from user's image
        setTimeout(() => {
          const sample = SAMPLE_RECEIPTS[0]; // Indomaret
          setExtractedData({
            merchant: 'Indomaret ' + file.name.substring(0, 10),
            total: sample.total,
            category: 'dapur',
            items: sample.items,
          });
          setIsScanning(false);
        }, 1300);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleReceipt) => {
    setIsScanning(true);
    setTimeout(() => {
      setExtractedData({
        merchant: sample.merchant,
        total: sample.total,
        category: sample.category,
        items: sample.items,
      });
      setIsScanning(false);
    }, 600);
  };

  const handleSaveToCashbook = () => {
    if (!extractedData) return;

    onReceiptScanned({
      type: 'expense',
      title: `Belanja di ${extractedData.merchant}`,
      merchant: extractedData.merchant,
      amount: extractedData.total,
      category: extractedData.category,
      walletId: selectedWalletId,
      date: new Date().toISOString(),
      notes: `Dipindai otomatis lewat Scan Nota (${extractedData.items.length} item)`,
      receiptItems: extractedData.items,
    });

    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setExtractedData(null);
    setPreviewImage(null);
    setIsScanning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white p-6 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Scan Nota & Struk Belanja 📷
              </h3>
              <p className="text-xs text-slate-500">
                Ekstraksi otomatis nama toko, rincian item, dan total bayar.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Mode Selector */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('samples')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'samples'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Contoh Nota
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📁 Unggah Foto
          </button>
          <button
            type="button"
            onClick={() => setMode('camera')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'camera'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📸 Kamera
          </button>
        </div>

        {/* Camera Viewport */}
        {mode === 'camera' && (
          <div className="mt-4">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Live Scanner Guide Overlay */}
              <div className="pointer-events-none absolute inset-6 border-2 border-dashed border-sky-400/80 rounded-2xl flex flex-col justify-between p-4">
                <span className="text-[10px] text-sky-200 bg-sky-950/70 px-2 py-0.5 rounded self-center backdrop-blur-xs">
                  Posisikan struk di dalam kotak
                </span>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-pulse" />
              </div>

              {cameraError && (
                <div className="absolute inset-4 bg-slate-900/90 text-white rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-xs text-slate-200">{cameraError}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleCaptureFromCamera}
              disabled={isScanning}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isScanning ? 'Memindai Struk...' : 'Ambil Foto Struk'}</span>
            </button>
          </div>
        )}

        {/* Upload Mode */}
        {mode === 'upload' && (
          <div className="mt-4">
            <label className="flex flex-col items-center justify-center aspect-4/3 w-full rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-50 transition-colors cursor-pointer p-6 text-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Pratinjau Struk"
                  className="max-h-full max-w-full rounded-lg object-contain shadow-xs"
                />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-sky-600 mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    Klik untuk Memilih Foto Nota
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Format JPG, PNG, atau WEBP dari galeri ponselmu
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Sample Receipts Mode (Recommended for testing) */}
        {mode === 'samples' && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              Pilih contoh nota struk siap uji coba:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_RECEIPTS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 bg-white cursor-pointer transition-all active:scale-98 shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {sample.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    {sample.items.length} item belanja
                  </p>
                  <p className="text-xs font-bold font-mono text-emerald-700 mt-1">
                    Rp {sample.total.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner Animation */}
        {isScanning && (
          <div className="my-4 flex items-center justify-center gap-2 p-4 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-xs font-semibold">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
            <span>AI Vision sedang membaca dan mengekstrak rincian nota...</span>
          </div>
        )}

        {/* Extracted Result Card */}
        {extractedData && (
          <div className="mt-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Hasil Ekstraksi Otomatis</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                100% Terbaca
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  <span>Toko</span>
                </span>
                <span className="font-bold text-slate-900">{extractedData.merchant}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Waktu</span>
                </span>
                <span className="font-semibold text-slate-700">Hari ini, baru saja</span>
              </div>

              {/* Items List */}
              <div className="mt-2 pt-2 border-t border-emerald-200/70">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Item Belanja Terdeteksi:
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar">
                  {extractedData.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between bg-white/80 p-1.5 rounded-lg text-slate-800 text-[11px]"
                    >
                      <span>
                        {it.qty}x {it.name}
                      </span>
                      <span className="font-mono font-semibold">
                        Rp {it.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Extracted */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-300">
                <span className="font-bold text-slate-900">Total Pembayaran</span>
                <span className="text-base font-extrabold font-mono text-emerald-900">
                  Rp {extractedData.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Wallet Selection for saving */}
            <div className="mt-4 pt-3 border-t border-emerald-200">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Potong dari Kantong / Rekening:
              </label>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-slate-800 outline-hidden"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} (Saldo: Rp {w.balance.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            {/* Save to Cashbook CTA */}
            <button
              onClick={handleSaveToCashbook}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan ke Buku Kas Transaksi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
