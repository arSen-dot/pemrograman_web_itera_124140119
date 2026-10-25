import { useState, useEffect } from 'react';

/**
 * Custom hook: useLocalStorage
 * Menyimpan state React ke localStorage secara persisten.
 * - Nilai awal dibaca dari localStorage (jika ada), kalau tidak pakai initialValue.
 * - Setiap nilai berubah, otomatis ditulis kembali ke localStorage (via useEffect).
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initializer: baca localStorage hanya sekali saat pertama render.
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      // Kalau data rusak / localStorage tidak tersedia, pakai nilai awal.
      return initialValue;
    }
  });

  // Tulis ke localStorage setiap kali value berubah.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Abaikan kegagalan tulis (mis. kuota penuh) agar app tidak crash.
    }
  }, [key, value]);

  return [value, setValue];
}
