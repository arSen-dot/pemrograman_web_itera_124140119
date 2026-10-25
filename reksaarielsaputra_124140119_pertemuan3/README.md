# BukuKu — Aplikasi Manajemen Buku Pribadi

Tugas Praktikum Pemrograman Aplikasi Web (PAW) Pertemuan 3 —
Reksa Ariel Saputra (124140119).

Aplikasi React untuk mencatat koleksi buku pribadi: buku yang dimiliki,
sedang dibaca, atau ingin dibeli. Data tersimpan persisten di
`localStorage` sehingga tidak hilang saat halaman dimuat ulang.

## Fitur

- **Tambah buku** — judul, penulis, dan status (Milik / Sedang Dibaca / Ingin Dibeli).
- **Ubah & hapus buku** — setiap kartu buku punya tombol Ubah dan Hapus
  (hapus meminta konfirmasi dulu).
- **Filter berdasar status** — Semua, Milik, Sedang Dibaca, Ingin Dibeli.
- **Pencarian** — berdasar judul atau nama penulis (tidak peka huruf besar/kecil).
- **Halaman Statistik** — total buku dan jumlah per status.
- **Validasi form** — judul dan penulis wajib diisi; field kosong menampilkan
  pesan error dan garis merah (feedback visual).

## Contoh tampilan dalam aplikasi
screenshot-home.png
screenshot-stats.png

## Cara Instalasi & Menjalankan

```bash
# 1. Masuk ke folder project
cd reksaarielsaputra_124140119_pertemuan3

# 2. Pasang dependensi
npm install
 
# 3. Jalankan mode development
npm run dev
# Buka http://localhost:5173 di browser

# 4. Jalankan unit test
npx vitest run

# 5. Build untuk production
npm run build
```

## Fitur React yang Digunakan

| Konsep | Penerapan |
|---|---|
| `useState` | State form (`BookForm`), pencarian & filter (`Home`), state global buku (`BookContext`) |
| `useEffect` | Sinkronisasi state ke `localStorage` di `useLocalStorage`; mengisi form saat mode edit |
| `useMemo` | Menghitung daftar buku tampil (filter + pencarian) dan statistik tanpa hitung ulang sia-sia |
| Komponen reusable (3+) | `BookForm`, `BookList`, `BookFilter` — dipakai ulang di halaman Home |
| Context API | `BookContext` (`BookProvider` + `useBooks`) menyimpan daftar buku & fungsi tambah/ubah/hapus untuk semua halaman |
| React Router | `BrowserRouter` + `Routes`: `/` (Home: koleksi buku), `/stats` (Stats: statistik) |
| Custom hooks (2) | `useLocalStorage(key, initialValue)` — state persisten; `useBookStats(books)` — hitung total & per status |
| PropTypes | Dipakai di **semua** komponen (`BookForm`, `BookList`, `BookFilter`, `BookProvider`) |
| Unit test (16 test) | Vitest + React Testing Library + jsdom; lihat `TESTING.md` |

## Struktur Folder

```
src/
├── components/
│   ├── BookForm/BookForm.jsx + .css (+ .test.jsx)
│   ├── BookList/BookList.jsx + .css (+ .test.jsx)
│   └── BookFilter/BookFilter.jsx + .css (+ .test.jsx)
├── pages/
│   ├── Home/Home.jsx + .css
│   └── Stats/Stats.jsx + .css
├── hooks/
│   ├── useLocalStorage.js (+ .test.js)
│   └── useBookStats.js (+ .test.js)
├── context/
│   └── BookContext.jsx
├── test/
│   └── setup.js
├── App.jsx + App.css
├── main.jsx
└── index.css
```
