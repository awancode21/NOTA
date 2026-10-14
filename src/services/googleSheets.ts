import { Transaction, Wallet } from '../types/finance';

export interface RemoteSpreadsheet {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
}

const HEADERS = [
  'Tanggal',
  'Keterangan Transaksi',
  'Kategori',
  'Sumber Kantong',
  'Tipe',
  'Nominal (Rp)',
  'Toko / Merchant',
  'Catatan',
  'Rincian Item Nota',
];

/**
 * Buat spreadsheet Google Sheets baru untuk pembukuan keuangan
 */
export async function createFinanceSpreadsheet(
  accessToken: string,
  customTitle?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const dateStr = new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
  const title = customTitle || `DompetRamah - Catatan Keuangan (${dateStr})`;

  const payload = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Transaksi Kas',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gagal membuat spreadsheet (${response.status})`);
  }

  const result = await response.json();
  const spreadsheetId = result.spreadsheetId;
  const spreadsheetUrl =
    result.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Format baris data transaksi untuk Google Sheets
 */
function formatTransactionRows(transactions: Transaction[], wallets: Wallet[]): (string | number)[][] {
  return transactions.map((t) => {
    const wallet = wallets.find((w) => w.id === t.walletId)?.name || t.walletId;
    const formattedDate = new Date(t.date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const receiptSummary = t.receiptItems && t.receiptItems.length > 0
      ? t.receiptItems.map((item) => `${item.qty}x ${item.name} (@Rp${item.price.toLocaleString('id-ID')})`).join('; ')
      : '-';

    return [
      formattedDate,
      t.title,
      t.category,
      wallet,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.amount,
      t.merchant || '-',
      t.notes || '-',
      receiptSummary,
    ];
  });
}

/**
 * Sinkronisasi seluruh transaksi ke Google Sheet terpilih (menimpa atau mengisi ulang data)
 */
export async function syncAllTransactionsToSheet(
  accessToken: string,
  spreadsheetId: string,
  transactions: Transaction[],
  wallets: Wallet[]
): Promise<{ updatedRows: number }> {
  const rows = formatTransactionRows(transactions, wallets);
  const allValues = [HEADERS, ...rows];

  // We write to 'Transaksi Kas!A1'
  const range = 'Transaksi Kas!A1:I' + (allValues.length + 1);

  // Clear existing range first to avoid orphan rows
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transaksi Kas!A1:Z500:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Write new data
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transaksi Kas!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: 'Transaksi Kas!A1',
        majorDimension: 'ROWS',
        values: allValues,
      }),
    }
  );

  if (!updateRes.ok) {
    const errData = await updateRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gagal menyinkronkan data (${updateRes.status})`);
  }

  // Format header row with emerald background and bold text
  try {
    await styleSheetHeader(accessToken, spreadsheetId);
  } catch (err) {
    console.warn('Gagal memformat warna header sheet:', err);
  }

  return { updatedRows: rows.length };
}

/**
 * Menambahkan transaksi baru ke bagian bawah sheet (append)
 */
export async function appendTransactionToSheet(
  accessToken: string,
  spreadsheetId: string,
  transaction: Transaction,
  wallets: Wallet[]
): Promise<void> {
  const row = formatTransactionRows([transaction], wallets)[0];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transaksi Kas!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  );

  if (!appendRes.ok) {
    const errData = await appendRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Gagal menambahkan transaksi ke Sheet');
  }
}

/**
 * Mempercantik header Google Sheets (warna emerald dan teks tebal)
 */
async function styleSheetHeader(accessToken: string, spreadsheetId: string) {
  const requests = [
    {
      repeatCell: {
        range: {
          sheetId: 0,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: HEADERS.length,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: {
              red: 0.05,
              green: 0.5,
              blue: 0.35,
            },
            textFormat: {
              foregroundColor: {
                red: 1.0,
                green: 1.0,
                blue: 1.0,
              },
              fontSize: 10,
              bold: true,
            },
            horizontalAlignment: 'CENTER',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
      },
    },
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });
}

/**
 * Dapatkan daftar Google Sheets yang pernah dibuat atau diakses aplikasi di Google Drive
 */
export async function listAppSpreadsheets(accessToken: string): Promise<RemoteSpreadsheet[]> {
  try {
    const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,modifiedTime)&pageSize=10&orderBy=modifiedTime desc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.warn('Gagal membaca daftar spreadsheet Drive:', err);
    return [];
  }
}
