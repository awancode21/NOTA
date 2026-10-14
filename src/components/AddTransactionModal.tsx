import React, { useState } from 'react';
import { Transaction, Wallet, CategoryId, ReceiptItem } from '../types/finance';
import { CATEGORIES } from '../data/mockData';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  wallets: Wallet[];
  onClose: () => void;
  onAddTransaction: (newTx: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  wallets,
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [title, setTitle] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<CategoryId>('makan');
  const [walletId, setWalletId] = useState<string>(wallets[0]?.id || 'gopay');
  const [notes, setNotes] = useState('');
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPriceStr, setNewItemPriceStr] = useState('');

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPriceStr) return;
    const price = parseInt(newItemPriceStr.replace(/\D/g, ''), 10) || 0;
    const newItem: ReceiptItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      qty: 1,
      price,
    };
    const updated = [...receiptItems, newItem];
    setReceiptItems(updated);
    setNewItemName('');
    setNewItemPriceStr('');

    // If amount is empty or matches sum, auto-calculate amount
    const sum = updated.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
    if (!amountStr || parseInt(amountStr, 10) < sum) {
      setAmountStr(sum.toString());
    }
  };

  const handleRemoveItem = (id: string) => {
    setReceiptItems(receiptItems.filter((i) => i.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr.replace(/\D/g, ''), 10);
    if (!amount || isNaN(amount) || !title.trim()) {
      alert('Mohon masukkan judul dan nominal transaksi yang valid.');
      return;
    }

    onAddTransaction({
      type,
      title: title.trim(),
      merchant: merchant.trim() || undefined,
      amount,
      category,
      walletId,
      date: new Date().toISOString(),
      notes: notes.trim() || undefined,
      receiptItems: receiptItems.length > 0 ? receiptItems : undefined,
    });

    // Reset form
    setAmountStr('');
    setTitle('');
    setMerchant('');
    setNotes('');
    setReceiptItems([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Catat Transaksi Baru ✍️
            </h3>
            <p className="text-xs text-slate-500">
              Pencatatan cepat dan rapi untuk buku kas harianmu.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Transaction Type Segmented Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💸 Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💰 Pemasukan
            </button>
          </div>

          {/* Nominal Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal (Rp) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                required
                placeholder="50000"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono text-base font-bold text-slate-900 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Title & Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan Transaksi *
              </label>
              <input
                type="text"
                required
                placeholder="cth: Makan Siang Nasi Padang"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-900 outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Toko / Merchant (Opsional)
              </label>
              <input
                type="text"
                placeholder="cth: RM Padang Sederhana"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-900 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Wallet & Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sumber Kantong / Rekening
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 bg-white text-xs font-medium text-slate-800 outline-hidden transition-all"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.logoText})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Transaksi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 bg-white text-xs font-medium text-slate-800 outline-hidden transition-all"
              >
                {CATEGORIES.filter((c) => c.id !== 'semua').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Receipt Items Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Rincian Barang Nota (Opsional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nama item (cth: Es Teh)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 outline-hidden"
              />
              <input
                type="number"
                placeholder="Harga (cth: 5000)"
                value={newItemPriceStr}
                onChange={(e) => setNewItemPriceStr(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-800 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                + Tambah
              </button>
            </div>

            {receiptItems.length > 0 && (
              <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-200">
                {receiptItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-100"
                  >
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900 font-semibold">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Pengingat
            </label>
            <input
              type="text"
              placeholder="cth: Dibayarin patungan sama teman..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-900 outline-hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Catatan Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
