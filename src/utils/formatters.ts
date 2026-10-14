/**
 * Format angka menjadi format Rupiah Indonesia yang rapi
 */
export function formatRupiah(amount: number, hideAmount: boolean = false): string {
  if (hideAmount) {
    return 'Rp ••••••';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal menjadi format relatif yang bersahabat
 * Contoh: "Hari ini, 07:10", "Kemarin, 14:20", "3 Okt, 12:30"
 */
export function formatRelativeDate(isoDateStr: string): string {
  const date = new Date(isoDateStr);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (isToday) {
    return `Hari ini, ${timeStr}`;
  }

  if (isYesterday) {
    return `Kemarin, ${timeStr}`;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = date.getDate();
  const monthName = months[date.getMonth()];

  return `${day} ${monthName}, ${timeStr}`;
}

/**
 * Sapaan hangat dinamis berdasarkan waktu saat ini
 */
export function getGreetingByTime(): { greeting: string; icon: string; message: string } {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 11) {
    return {
      greeting: 'Selamat Pagi',
      icon: '☀️',
      message: 'Semoga harimu menyenangkan & rezeki lancar!',
    };
  } else if (hour >= 11 && hour < 15) {
    return {
      greeting: 'Selamat Siang',
      icon: '🌤️',
      message: 'Jangan lupa istirahat & pantau pos makan siang.',
    };
  } else if (hour >= 15 && hour < 18) {
    return {
      greeting: 'Selamat Sore',
      icon: '🌅',
      message: 'Waktu santai sejenak sehabis produktif beraktivitas.',
    };
  } else {
    return {
      greeting: 'Selamat Malam',
      icon: '🌙',
      message: 'Evaluasi pengeluaran hari ini sebelum beristirahat pulas.',
    };
  }
}
