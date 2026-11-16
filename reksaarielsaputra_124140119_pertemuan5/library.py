"""library.py -- Pengelola koleksi perpustakaan (Praktikum PAW Pertemuan 5).

Class ``Library`` menyimpan seluruh item dalam atribut private
``__koleksi`` (sebuah list). Koleksi tidak bisa diakses langsung dari luar
class -- semua akses lewat method yang disediakan (encapsulation).
"""

from library_item import LibraryItem


class Library:
    """Menyimpan dan mengelola koleksi item perpustakaan."""

    def __init__(self, nama="Perpustakaan"):
        """Membuat perpustakaan kosong dengan nama tertentu."""
        self.__nama = nama
        self.__koleksi = []

    @property
    def nama(self):
        """Nama perpustakaan (read-only)."""
        return self.__nama

    @property
    def jumlah_item(self):
        """Jumlah seluruh item dalam koleksi (read-only)."""
        return len(self.__koleksi)

    def tambah_item(self, item):
        """Menambahkan item ke koleksi.

        Mengembalikan True jika berhasil, False jika ID sudah ada
        (ID harus unik) atau item bukan turunan LibraryItem.
        """
        if not isinstance(item, LibraryItem):
            return False
        if any(existing.item_id == item.item_id for existing in self.__koleksi):
            return False
        self.__koleksi.append(item)
        return True

    def tampilkan_katalog(self):
        """Menampilkan seluruh item beserta status ketersediaannya."""
        print(f"\n=== Katalog {self.nama} ({self.jumlah_item} item) ===")
        if not self.__koleksi:
            print("Katalog masih kosong.")
            return
        for nomor, item in enumerate(self.__koleksi, start=1):
            print(f"{nomor}. {item.get_detail()} | Status: {item.status()}")

    def cari_item(self, kata_kunci):
        """Mencari item berdasarkan judul atau ID.

        Pencarian tidak peka huruf besar/kecil; kecocokan pada judul
        boleh sebagian (substring), sedangkan ID harus cocok persis.
        Mengembalikan list item yang cocok (bisa kosong).
        """
        kunci = kata_kunci.strip().lower()
        hasil = []
        for item in self.__koleksi:
            if kunci == item.item_id.lower() or kunci in item.judul.lower():
                hasil.append(item)
        return hasil

    def pinjam_item(self, item_id):
        """Menandai item sebagai dipinjam; False jika tidak ada / sudah dipinjam."""
        for item in self.__koleksi:
            if item.item_id == item_id:
                if item.is_dipinjam:
                    return False
                item.is_dipinjam = True
                return True
        return False

    def kembalikan_item(self, item_id):
        """Menandai item sebagai tersedia kembali; False jika tidak ada / belum dipinjam."""
        for item in self.__koleksi:
            if item.item_id == item_id:
                if not item.is_dipinjam:
                    return False
                item.is_dipinjam = False
                return True
        return False
