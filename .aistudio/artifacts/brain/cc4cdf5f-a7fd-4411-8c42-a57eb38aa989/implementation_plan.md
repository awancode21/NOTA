# Aplikasi Keuangan Pribadi Ramah: Pembaruan Smartphone Friendly UI

Rencana desain dan implementasi pembaruan antarmuka pencatatan keuangan ramah (friendly), hangat, dan modern dengan fokus ergonomi jempol smartphone, kartu saldo emerald, dompet visual, pemindaian struk otomatis, serta laci detail transaksi bawah (bottom drawer).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi pertanyaan klarifikasi sebelumnya:
> - **Pemindaian Struk**: Menggunakan kamera interaktif dan unggah foto dengan ekstraksi item belanja otomatis langsung di peramban.
> - **Sinkronisasi Mutasi & Sheets**: Menggunakan simulasi mutasi perbankan otomatis (BCA/Mandiri/GoPay) dan ekspor data Google Sheets (CSV/JSON/Google Sheets table viewer).
> - **Penyajian di Desktop**: Menyajikan bingkai ponsel pintar (modern smartphone chassis) yang realistis di layar lebar, dilengkapi tombol toggle untuk beralih ke mode layar penuh (responsive full-width).

---

### 1. Gambaran Umum & Konsep Utama

- **Fungsi Aplikasi**: Aplikasi pencatatan dan pengelolaan keuangan harian berbahasa Indonesia yang ramah, hangat, dan tidak menakutkan, mempermudah pengguna memantau kesehatan finansial, mencatat pengeluaran harian, memindai nota belanja, dan mengelola kantong saldo.
- **Target Pengguna**: Pengguna harian, keluarga muda, dan profesional mandiri yang menginginkan cara cepat dan menyenangkan untuk mengatur uang tanpa kerumitan spreadsheet manual.
- **Nilai Utama**: Menghilangkan rasa cemas terhadap keuangan dengan sapaan hangat, kartu saldo gradien emerald yang memikat, tombol jempol berumpan balik taktil, dan laci interaktif yang rapi.

---

### 2. Pengalaman Pengguna & Desain Visual

#### A. Komponen Antarmuka Utama

1. **Header Sapaan Personal & Status Keuangan Hangat**:
   - Sapaan dinamis berdasarkan jam lokal pengguna: `"Selamat Pagi ☀️"`, `"Selamat Siang 🌤️"`, `"Selamat Sore 🌅"`, atau `"Selamat Malam 🌙"`.
   - Avatar inisial `"AF"` dengan cincin hijau lembut dan badge status `"Kondisi Keuangan Prima ✨"`.
   - Tombol toggle mata *"Privasi"* untuk menyembunyikan/menampilkan nominal saldo dengan efek sensor bintang (`••••••`).

2. **Kartu Saldo Hangat & Modern (Warm Emerald Gradient Card)**:
   - Permukaan gradien halus `from-emerald-700 via-teal-800 to-emerald-950` dengan sudut lengkung lembut `rounded-[28px]`, pola lingkaran geometris halus, dan bayangan lembut.
   - Indikator kesehatan finansial: pill unboxed `"Rasio Tabungan: 55% · Sangat Sehat 🎯"`.
   - Sub-metrik semi-transparan: Pemasukan (ikon panah hijau lembut) dan Pengeluaran bulanan (ikon panah merah lembut).

3. **Pusat Aksi Cepat Ramah Jempol (5 Tombol Sentuh Ceria)**:
   - ➕ **Catat**: Tombol emerald untuk menambah transaksi baru manual.
   - 📷 **Scan**: Tombol biru langit untuk mengambil foto/memindai nota struk belanja dengan kamera langsung atau unggahan file.
   - ⚡ **Sync**: Tombol ungu untuk menarik mutasi bank otomatis secara instan.
   - 📊 **Laporan**: Tombol amber untuk melihat visualisasi pengeluaran bulanan dan kategori.
   - 📗 **Sheets**: Tombol teal untuk sinkronisasi dan ekspor lembar kerja Google Sheets.
   - Umpan balik taktil interaktif `active:scale-95 transition-all`.

4. **"Belanja Hari Ini" & Pintasan Nota Struk**:
   - Kartu ringkasan interaktif yang menampilkan total pengeluaran hari ini (misal: `"Rp 52.000 ☕"` atau `"Belum Ada (Hemat! 🎉)"`).
   - Tombol pintasan cepat `+ Scan Nota` langsung dari kartu.

5. **Catatan Cerdas Finansialmu (Smart Tips)**:
   - Kartu motivasi bersahabat dengan tips hemat harian dinamis berdasarkan rasio pengeluaran (misal saran hemat kopi, alokasi investasi, atau evaluasi anggaran belanja).

6. **Kantong & Rekening Saya yang Berwarna (Visual Wallets Carousel)**:
   - Kartu mini rekening geser (horizontal snap-scroll):
     - **BCA**: Biru khas BCA dengan logo dan sisa saldo.
     - **Mandiri**: Biru tua emas khas Mandiri.
     - **GoPay**: Hijau toska muda khas dompet digital.
     - **Kas Tunai**: Hijau amber segar untuk dompet fisik.
   - Interaksi ketuk untuk memfilter transaksi berdasarkan rekening atau menambahkan dana.

7. **Buku Kas Ramah dengan Filter Cepat & Bottom Drawer**:
   - Filter cepat kategori: *Semua*, *Belanja Dapur 🛒*, *Makan & Kopi ☕*, *Transport 🚗*, *Tagihan 💡*, *Hiburan 🎬*.
   - Format waktu relatif ramah: *"Hari ini, 07:10"*, *"Kemarin, 14:20"*, *"3 Okt, 12:30"*.
   - **Slide-Up Bottom Drawer**: Mengetuk transaksi memunculkan laci bawah yang mulus dengan rincian struk (item belanja, harga satuan, metode bayar), tombol edit cepat, dan hapus transaksi.

8. **Navigasi Bawah (Bottom Tab Bar) & Floating Scan Button**:
   - Tab navigasi ergonomis: Beranda, Mutasi, Laporan, Kantong.
   - Tombol tengah mengambang (Floating Action Button) untuk Scan Struk dengan animasi gradien dinamis dan bayangan halus.

9. **Desktop Wrapper (Smartphone Frame & Mode Toggle)**:
   - Di layar desktop/tablet, aplikasi dikemas dalam frame smartphone modern (bezel tipis, speaker notch / dynamic island, bayangan realistis) dengan tombol switcher di pojok atas untuk berganti ke tampilan layar penuh responsif kapan saja.

---

### 3. Keputusan Produk & Arsitektur Teknis

```
┌─────────────────────────────────────────────────────────────┐
│                       App Container                         │
│   (Mode Switcher: Realistic Phone Frame <-> Full Responsive) │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Friendly Finance UI                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Header: Sapaan Waktu Dinamis + Avatar + Privasi Toggle   │
│ 2. Emerald Gradient Card: Total Saldo + Rasio Tabungan     │
│ 3. 5-Button Thumb Hub: Catat, Scan, Sync, Laporan, Sheets   │
│ 4. Belanja Hari Ini Card + Pintasan Scan Struk              │
│ 5. Smart Financial Tips: Motivasi Finansial Dinamis         │
│ 6. Visual Wallets: BCA, Mandiri, GoPay, Kas Tunai           │
│ 7. Buku Kas Transaksi: Filter Kategori + Waktu Relatif      │
│ 8. Fixed Bottom Tab Bar + Floating Center Camera Button     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     Interactive Drawers                     │
│  - Transaction Detail Slide-Up Bottom Drawer                │
│  - Quick Add Transaction Modal (Catat)                      │
│  - Interactive Receipt Scanner (Camera / Upload / AI Parse) │
│  - Bank Sync Simulation Modal (BCA/Mandiri/GoPay)           │
│  - Analytics & Category Breakdown View                      │
│  - Google Sheets Export / Viewer Dialog                     │
└─────────────────────────────────────────────────────────────┘
```

- **Penyimpanan Data**: `localStorage` persisten di browser dengan data awal Indonesia yang kaya dan realistis (misal: kopi susu kekinian, belanja Indomaret/Superindo, bensin Pertamina, langganan internet, transfer gaji).
- **Pemindai Struk**: Menggunakan antarmuka kamera video stream langsung (dengan fallback unggah file gambar), dilengkapi fitur pratinjau struk, ekstraksi nama toko, tanggal, item belanja individual, pajak/diskon, dan total belanja otomatis ke form transaksi.
- **Simulasi Mutasi Bank**: Generator mutasi cerdas yang memungkinkan pengguna menarik 1–3 transaksi mutasi terbaru dari BCA, Mandiri, atau GoPay hanya dengan satu ketukan.
- **Ekspor Google Sheets**: Menghasilkan format tabel siap salin/unduh CSV yang kompatibel langsung dengan Google Sheets, lengkap dengan formula ringkasan.

---

### 4. Rencana Eksekusi

1. **Persiapan Model & Utilitas**: Tipe data transaksi, akun rekening, kategori, format mata uang Rupiah (`IDR`), dan fungsi pemformat waktu relatif.
2. **Komponen Inti**:
   - `SmartphoneFrame`: Wrapper bingkai ponsel dengan indikator baterai, sinyal, jam, dan tombol toggle layar penuh.
   - `HeaderGreeting`: Sapaan dinamis waktu, avatar, dan toggle privasi saldo.
   - `WarmEmeraldCard`: Kartu saldo gradien, rasio tabungan, dan sub-metrik pemasukan/pengeluaran.
   - `ThumbActionHub`: 5 tombol aksi taktil dengan warna khas dan animasi tekan.
   - `TodaySpendingBanner`: Widget ringkasan belanja hari ini dan tombol scan nota.
   - `SmartTipsCard`: Kartu motivasi finansial ramah.
   - `VisualWalletsCarousel`: Mini kartu rekening BCA, Mandiri, GoPay, Tunai.
   - `CashbookList`: Daftar transaksi dengan filter kategori cerah dan badge waktu relatif.
   - `BottomDrawer`: Laci detail transaksi slide-up dari bawah layar.
   - `Modals`: Modal Catat Transaksi, Modal Scan Struk (kamera + unggah + ekstraksi cerdas), Modal Sync Mutasi Bank, Modal Analisis Laporan, dan Modal Google Sheets.
   - `BottomTabBar`: Tab bar bawah dengan tombol scan mengambang di tengah.
3. **Verifikasi & Kompilasi**: Menjalankan lint dan kompilasi untuk memastikan integritas tipe dan bebas galat.
