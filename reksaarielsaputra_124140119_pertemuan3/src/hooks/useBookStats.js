import { useMemo } from 'react';

/**
 * Custom hook: useBookStats
 * Menghitung statistik koleksi buku: total dan jumlah per status.
 * useMemo dipakai agar perhitungan hanya diulang saat daftar buku berubah.
 *
 * @param {Array} books - daftar buku { id, title, author, status }
 * @returns {{ total: number, milik: number, baca: number, beli: number }}
 */
export function useBookStats(books) {
  return useMemo(() => {
    const stats = { total: books.length, milik: 0, baca: 0, beli: 0 };
    for (const book of books) {
      if (book.status === 'milik') stats.milik += 1;
      else if (book.status === 'baca') stats.baca += 1;
      else if (book.status === 'beli') stats.beli += 1;
    }
    return stats;
  }, [books]);
}
