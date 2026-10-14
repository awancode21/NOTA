import React, { useState, useEffect } from 'react';
import { Transaction, Wallet, ActiveTab } from './types/finance';
import { INITIAL_WALLETS, INITIAL_TRANSACTIONS } from './data/mockData';
import { SmartphoneFrame } from './components/SmartphoneFrame';
import { HeaderGreeting } from './components/HeaderGreeting';
import { WarmEmeraldCard } from './components/WarmEmeraldCard';
import { ThumbActionHub } from './components/ThumbActionHub';
import { TodaySpendingBanner } from './components/TodaySpendingBanner';
import { SmartTipsCard } from './components/SmartTipsCard';
import { VisualWalletsCarousel } from './components/VisualWalletsCarousel';
import { CashbookSection } from './components/CashbookSection';
import { BottomTabBar } from './components/BottomTabBar';
import { BottomDrawer } from './components/BottomDrawer';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { BankSyncModal } from './components/BankSyncModal';
import { SheetsExportModal } from './components/SheetsExportModal';
import { ReportsModal } from './components/ReportsModal';
import { AddFundsModal } from './components/AddFundsModal';

const STORAGE_KEY_TRANSACTIONS = 'dompet_ramah_transactions_v1';
const STORAGE_KEY_WALLETS = 'dompet_ramah_wallets_v1';
const STORAGE_KEY_PRIVACY = 'dompet_ramah_privacy_v1';

export default function App() {
  // Persistence state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WALLETS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_WALLETS;
  });

  const [isPrivate, setIsPrivate] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRIVACY);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return false;
  });

  // Navigation and Filter state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  // Modals & Drawer State
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [walletToTopUp, setWalletToTopUp] = useState<Wallet | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WALLETS, JSON.stringify(wallets));
    } catch {
      // ignore
    }
  }, [wallets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRIVACY, JSON.stringify(isPrivate));
    } catch {
      // ignore
    }
  }, [isPrivate]);

  // Aggregate Metrics Calculations
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Savings ratio calculation (default 55% as per friendly design, or dynamic)
  const calculatedSavingsRatio =
    totalIncome > 0
      ? Math.max(10, Math.min(85, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)))
      : 55;

  // Today's spending
  const now = new Date();
  const todayTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear() &&
      t.type === 'expense'
    );
  });

  const todayExpense = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Handlers
  const handleTogglePrivacy = () => {
    setIsPrivate((prev) => !prev);
  };

  const handleOpenTransactionDetail = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsBottomDrawerOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    // Refund / adjust balance back to wallet
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === target.walletId) {
          return {
            ...w,
            balance: target.type === 'expense' ? w.balance + target.amount : w.balance - target.amount,
          };
        }
        return w;
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };

    // Update wallet balance
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === newTx.walletId) {
          const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
          return { ...w, balance: Math.max(0, w.balance + delta) };
        }
        return w;
      })
    );

    // Add to transaction history
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleSyncMutations = (newItems: Omit<Transaction, 'id'>[]) => {
    const created: Transaction[] = newItems.map((item, idx) => ({
      ...item,
      id: `tx-sync-${Date.now()}-${idx}`,
    }));

    // Update affected wallet balances
    setWallets((prev) => {
      const updated = [...prev];
      created.forEach((tx) => {
        const walletIdx = updated.findIndex((w) => w.id === tx.walletId);
        if (walletIdx !== -1) {
          const delta = tx.type === 'income' ? tx.amount : -tx.amount;
          updated[walletIdx] = {
            ...updated[walletIdx],
            balance: Math.max(0, updated[walletIdx].balance + delta),
          };
        }
      });
      return updated;
    });

    setTransactions((prev) => [...created, ...prev]);
  };

  const handleConfirmAddFunds = (walletId: string, amount: number, note: string) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, balance: w.balance + amount } : w))
    );

    // Record as income in cashbook
    const targetWallet = wallets.find((w) => w.id === walletId);
    handleAddTransaction({
      type: 'income',
      title: `Isi Saldo ${targetWallet?.name || walletId}`,
      merchant: targetWallet?.name,
      amount,
      category: 'gaji',
      walletId,
      date: new Date().toISOString(),
      notes: note,
    });
  };

  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setWallets(INITIAL_WALLETS);
    setSelectedWalletId(null);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'laporan') {
      setIsReportsModalOpen(true);
    } else if (tab === 'kantong') {
      // scroll to wallets or reset filter
      setSelectedWalletId(null);
    }
  };

  return (
    <SmartphoneFrame onResetData={handleResetData}>
      <div className="flex flex-col min-h-full pb-4">
        {/* 1. Header: Sapaan Waktu Personal & Status Finansial Hangat */}
        <HeaderGreeting
          isPrivate={isPrivate}
          onTogglePrivacy={handleTogglePrivacy}
          userName="Asep Fauzi"
          userInitial="AF"
        />

        {/* 2. Warm Emerald Gradient Card: Total Saldo & Rasio Tabungan Sehat */}
        <WarmEmeraldCard
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          isPrivate={isPrivate}
          savingsRatio={calculatedSavingsRatio}
        />

        {/* 3. Pusat Aksi Cepat Ramah Jempol (5 Tombol Sentuh Ceria) */}
        <ThumbActionHub
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenScanModal={() => setIsScanModalOpen(true)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onOpenReportModal={() => setIsReportsModalOpen(true)}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        />

        {/* 4. "Belanja Hari Ini" & Pintasan Nota Struk */}
        <TodaySpendingBanner
          todayExpense={todayExpense}
          itemCount={todayTransactions.length}
          isPrivate={isPrivate}
          onOpenScanModal={() => setIsScanModalOpen(true)}
          onViewTodayList={() => {
            // Filter to view today or scroll down
            const elem = document.getElementById('cashbook-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. Catatan Cerdas Finansialmu (Smart Tips) */}
        <SmartTipsCard savingsRatio={calculatedSavingsRatio} />

        {/* 6. Kantong & Rekening Saya yang Berwarna (Visual Wallets) */}
        <VisualWalletsCarousel
          wallets={wallets}
          selectedWalletId={selectedWalletId}
          onSelectWallet={setSelectedWalletId}
          isPrivate={isPrivate}
          onAddFunds={(w) => setWalletToTopUp(w)}
        />

        {/* 7. Buku Kas Ramah dengan Filter Cepat & Bottom Drawer */}
        <div id="cashbook-section">
          <CashbookSection
            transactions={transactions}
            wallets={wallets}
            selectedWalletId={selectedWalletId}
            onSelectTransaction={handleOpenTransactionDetail}
            isPrivate={isPrivate}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* 8. Navigasi Bawah (Bottom Tab Bar) Lebih Bersahabat */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenScanModal={() => setIsScanModalOpen(true)}
        />

        {/* Slide-Up Bottom Drawer for Transaction Detail */}
        <BottomDrawer
          transaction={selectedTransaction}
          wallets={wallets}
          isOpen={isBottomDrawerOpen}
          onClose={() => {
            setIsBottomDrawerOpen(false);
            setSelectedTransaction(null);
          }}
          onDelete={handleDeleteTransaction}
          isPrivate={isPrivate}
        />

        {/* Interactive Modals */}
        <AddTransactionModal
          isOpen={isAddModalOpen}
          wallets={wallets}
          onClose={() => setIsAddModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />

        <ReceiptScannerModal
          isOpen={isScanModalOpen}
          wallets={wallets}
          onClose={() => setIsScanModalOpen(false)}
          onReceiptScanned={handleAddTransaction}
        />

        <BankSyncModal
          isOpen={isSyncModalOpen}
          wallets={wallets}
          onClose={() => setIsSyncModalOpen(false)}
          onSyncMutations={handleSyncMutations}
        />

        <SheetsExportModal
          isOpen={isSheetsModalOpen}
          transactions={transactions}
          wallets={wallets}
          onClose={() => setIsSheetsModalOpen(false)}
          isPrivate={isPrivate}
        />

        <ReportsModal
          isOpen={isReportsModalOpen}
          transactions={transactions}
          onClose={() => setIsReportsModalOpen(false)}
          isPrivate={isPrivate}
          savingsRatio={calculatedSavingsRatio}
        />

        <AddFundsModal
          wallet={walletToTopUp}
          isOpen={walletToTopUp !== null}
          onClose={() => setWalletToTopUp(null)}
          onConfirmAddFunds={handleConfirmAddFunds}
        />
      </div>
    </SmartphoneFrame>
  );
}
