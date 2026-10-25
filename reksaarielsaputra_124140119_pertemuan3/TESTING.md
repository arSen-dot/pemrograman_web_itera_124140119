# Laporan Testing — BukuKu (Tugas Praktikum PAW Pertemuan 3)

Pengujian unit dijalankan dengan **Vitest 5** + **React Testing Library** + **jsdom**,
sesuai dependensi dev yang disyaratkan (`vitest`, `@testing-library/react`,
`@testing-library/jest-dom`, `jsdom`).

Perintah:

```bash
npx vitest run
```

## Hasil

- **Test files:** 5 passed (5)
- **Tests:** 16 passed (16)
- **Durasi:** 6.94 detik

## Rincian per file test

| File test | Jumlah test | Yang diuji |
|---|---|---|
| `src/hooks/useLocalStorage.test.js` | 4 | nilai awal saat kosong, tulis ke localStorage, baca data tersimpan, fallback saat data rusak |
| `src/hooks/useBookStats.test.js` | 2 | hitung total & per status, daftar kosong |
| `src/components/BookForm/BookForm.test.jsx` | 4 | pesan error saat kosong, onSubmit tidak dipanggil saat invalid, onSubmit dipanggil dengan data benar, mode edit |
| `src/components/BookList/BookList.test.jsx` | 4 | render daftar, hapus panggil onDelete(id), ubah panggil onEdit(book), pesan saat kosong |
| `src/components/BookFilter/BookFilter.test.jsx` | 2 | perubahan pencarian & filter status diteruskan ke parent |

## Output terminal asli

```
 RUN  v5.0.5 /home/hatch/workspace/tugas-paw-pertemuan-3/reksaarielsaputra_124140119_pertemuan3

 ✓ src/components/BookForm/BookForm.test.jsx (4 tests) 278ms
 ✓ src/components/BookList/BookList.test.jsx (4 tests) 295ms
 ✓ src/hooks/useLocalStorage.test.js (4 tests) 33ms
 ✓ src/components/BookFilter/BookFilter.test.jsx (2 tests) 77ms
 ✓ src/hooks/useBookStats.test.js (2 tests) 28ms

 Test Files  5 passed (5)
      Tests  16 passed (16)
   Start at  06:29:35
   Duration  6.94s (environment 70%, tests 12%, setup 8%, import 5%, transform 4%, worker 1%)
```

Semua test lulus, tidak ada yang gagal atau dilewati.
