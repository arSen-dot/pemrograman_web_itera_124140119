import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('mengembalikan initialValue saat localStorage masih kosong', () => {
    const { result } = renderHook(() => useLocalStorage('test-kosong', []));
    expect(result.current[0]).toEqual([]);
  });

  it('menyimpan nilai baru ke localStorage setiap ada perubahan', () => {
    const { result } = renderHook(() => useLocalStorage('test-tulis', 0));
    act(() => {
      result.current[1](42);
    });
    expect(result.current[0]).toBe(42);
    expect(JSON.parse(window.localStorage.getItem('test-tulis'))).toBe(42);
  });

  it('membaca nilai yang sudah tersimpan di localStorage', () => {
    window.localStorage.setItem('test-baca', JSON.stringify(['a', 'b']));
    const { result } = renderHook(() => useLocalStorage('test-baca', []));
    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('jatuh kembali ke initialValue jika data localStorage rusak', () => {
    window.localStorage.setItem('test-rusak', 'bukan-json{{{');
    const { result } = renderHook(() => useLocalStorage('test-rusak', 'aman'));
    expect(result.current[0]).toBe('aman');
  });
});
