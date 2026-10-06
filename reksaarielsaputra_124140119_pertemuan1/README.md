# Mini POS — Kasir & Keranjang Belanja Sederhana

Aplikasi web kasir kantin/toko kampus (Praktikum PAW — Tugas 1). Mencakup tiga kompetensi dasar: **validasi input form**, **kalkulator otomatis**, dan **manajemen keranjang berbasis localStorage**.

## Cara Menjalankan

Buka `index.html` langsung di browser (double-click), atau jalankan server lokal:

```bash
# tanpa dependensi
npx serve .

# atau
python -m http.server 8080
```

## Fitur

### 1. Validasi Form Input Barang
- **Nama Barang**: wajib diisi, minimal 3 karakter.
- **Harga Satuan**: wajib angka bulat positif, minimal Rp 500.
- **Jumlah / Qty**: wajib angka bulat minimal 1.
- Pesan peringatan **merah** muncul di bawah input yang salah; form tidak disubmit sampai valid, lalu otomatis di-reset.

### 2. Kalkulator & Perhitungan Otomatis
- **Subtotal per baris**: `Harga Satuan × Qty`.
- **Total Belanja**: jumlah seluruh subtotal.
- **Diskon 10%** otomatis jika total ≥ Rp 50.000, atau pakai kode promo **HEMAT10**.
- **Uang Bayar → Kembalian**: `Kembalian = Uang Bayar − Total Akhir`. Jika uang kurang, muncul peringatan "Uang kurang Rp …".

### 3. Keranjang & localStorage
- Tabel keranjang: **No, Nama Barang, Harga Satuan, Qty, Subtotal, Aksi**.
- Tombol **Hapus** per baris; total & diskon otomatis dihitung ulang.
- Qty bisa diubah langsung dari tabel.
- Data tersimpan via `JSON.stringify()` dan dimuat via `JSON.parse()` — bertahan saat refresh.
- Tombol **Transaksi Baru** mengosongkan keranjang dan membersihkan localStorage.

## Struktur

```
index.html   — struktur halaman
style.css    — gaya tampilan
script.js    — logika validasi, kalkulasi, keranjang, localStorage
```
