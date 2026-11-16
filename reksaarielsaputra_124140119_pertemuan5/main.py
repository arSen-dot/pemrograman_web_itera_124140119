"""main.py -- Demo Sistem Manajemen Perpustakaan (Praktikum PAW Pertemuan 5).

Menambahkan beberapa buku dan majalah, menampilkan katalog, mencari item
berdasarkan judul dan ID, serta mendemonstrasikan status ketersediaan dan
polymorphism (method get_detail dan hitung_denda yang berbeda per subclass).
"""

from library_item import Book, Magazine
from library import Library


def tampilkan_hasil_pencarian(perpustakaan, kata_kunci):
    """Mencari lalu mencetak hasil pencarian untuk satu kata kunci."""
    hasil = perpustakaan.cari_item(kata_kunci)
    print(f'\n--- Hasil pencarian "{kata_kunci}" ({len(hasil)} ditemukan) ---')
    if not hasil:
        print("Tidak ada item yang cocok.")
        return
    for item in hasil:
        print(f"- {item.get_detail()} | Status: {item.status()}")


def main():
    """Menjalankan seluruh demo fungsionalitas sistem perpustakaan."""
    perpustakaan = Library("Perpustakaan ITERA")

    # 1. Menambahkan item: 3 buku dan 2 majalah.
    daftar_item = [
        Book("B001", "Laskar Pelangi", 2005, "Andrea Hirata", 529),
        Book("B002", "Bumi", 2014, "Tere Liye", 440),
        Book("B003", "Filosofi Teras", 2018, "Henry Manampiring", 346),
        Magazine("M001", "National Geographic Indonesia", 2026, 45, "November"),
        Magazine("M002", "Tempo", 2026, 12, "November"),
    ]
    print("=== Menambahkan item ===")
    for item in daftar_item:
        berhasil = perpustakaan.tambah_item(item)
        print(f"{'OK  ' if berhasil else 'GAGAL'} {item.item_id} - {item.judul}")

    # ID duplikat harus ditolak (menunjukkan encapsulation + validasi).
    print("=== Uji ID duplikat ===")
    duplikat = Book("B001", "Judul Lain", 2020, "Penulis Lain", 100)
    print("OK   B001 - Judul Lain" if perpustakaan.tambah_item(duplikat)
          else "GAGAL B001 - Judul Lain (ID sudah ada)")

    # 2. Menampilkan katalog lengkap.
    perpustakaan.tampilkan_katalog()

    # 3. Mencari item berdasarkan judul dan berdasarkan ID.
    tampilkan_hasil_pencarian(perpustakaan, "Laskar")
    tampilkan_hasil_pencarian(perpustakaan, "M002")
    tampilkan_hasil_pencarian(perpustakaan, "tidak ada")

    # 4. Status ketersediaan: pinjam satu buku, lalu kembalikan.
    print("\n=== Demo status ketersediaan ===")
    print("Pinjam B002:", "berhasil" if perpustakaan.pinjam_item("B002") else "gagal")
    print("Pinjam B002 lagi:", "berhasil" if perpustakaan.pinjam_item("B002") else "gagal (sudah dipinjam)")
    perpustakaan.tampilkan_katalog()
    print("Kembalikan B002:", "berhasil" if perpustakaan.kembalikan_item("B002") else "gagal")

    # 5. Polymorphism: method yang sama, hasil berbeda per subclass.
    print("\n=== Demo polymorphism: hitung_denda (terlambat 3 hari) ===")
    for item in daftar_item:
        print(f"- {item.judul}: Rp{item.hitung_denda(3):,}")


if __name__ == "__main__":
    main()
