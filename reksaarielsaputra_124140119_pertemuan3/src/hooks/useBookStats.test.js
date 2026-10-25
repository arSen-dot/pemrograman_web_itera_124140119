import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBookStats } from './useBookStats';

const SAMPLE_BOOKS = [
  { id: '1', title: 'A', author: 'X', status: 'milik' },
  { id: '2', title: 'B', author: 'Y', status: 'milik' },
  { id: '3', title: 'C', author: 'Z', status: 'baca' },
  { id: '4', title: 'D', author: 'W', status: 'beli' },
];

describe('useBookStats', () => {
  it('menghitung total dan jumlah per status dengan benar', () => {
    const { result } = renderHook(() => useBookStats(SAMPLE_BOOKS));
    expect(result.current).toEqual({ total: 4, milik: 2, baca: 1, beli: 1 });
  });

  it('mengembalikan semua nol untuk daftar buku kosong', () => {
    const { result } = renderHook(() => useBookStats([]));
    expect(result.current).toEqual({ total: 0, milik: 0, baca: 0, beli: 0 });
  });
});
