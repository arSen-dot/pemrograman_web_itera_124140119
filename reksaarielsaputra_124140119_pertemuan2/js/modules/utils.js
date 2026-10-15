// js/modules/utils.js — fungsi utilitas pembantu (ES modules)

/** Selector helper (arrow function) */
export const $ = (selector, el = document) => el.querySelector(selector);

/** ID unik untuk item baru */
export const uid = () =>
  (crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));

/** Escape HTML agar input pengguna aman dirender */
export const escapeHtml = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

/** Daftar hari untuk select jadwal */
export const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

/** Format tanggal ISO -> "15 Okt 2026" (id-ID) */
export const formatTanggal = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Format tanggal + jam untuk catatan */
export const formatTanggalJam = (ts = Date.now()) =>
  new Date(ts).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

/** Jam sekarang HH:MM:SS */
export const jamSekarang = () =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** Nama hari ini dalam Bahasa Indonesia */
export const hariIni = () =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long' });
