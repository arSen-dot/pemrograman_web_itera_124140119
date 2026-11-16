"""library_item.py -- Definisi item perpustakaan (Praktikum PAW Pertemuan 5).

Berisi abstract class ``LibraryItem`` beserta dua subclass-nya, ``Book``
dan ``Magazine``. Setiap subclass mengimplementasikan kedua method abstract
dari parent class (``get_detail`` dan ``hitung_denda``) dengan caranya
sendiri -- inilah bentuk polymorphism pada program ini.
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Abstract class dasar untuk semua item di perpustakaan.

    Atribut identitas disimpan sebagai atribut private (name mangling
    ``__``) sehingga hanya bisa diakses lewat property (encapsulation).
    Status peminjaman disimpan sebagai atribut protected (``_dipinjam``)
    dan diakses lewat property ``is_dipinjam``.
    """

    def __init__(self, item_id, judul, tahun_terbit):
        """Membuat item baru dengan status awal tersedia (belum dipinjam)."""
        self.__item_id = item_id
        self.__judul = judul
        self.__tahun_terbit = tahun_terbit
        self._dipinjam = False

    @property
    def item_id(self):
        """ID unik item (read-only)."""
        return self.__item_id

    @property
    def judul(self):
        """Judul item (read-only)."""
        return self.__judul

    @property
    def tahun_terbit(self):
        """Tahun terbit item (read-only)."""
        return self.__tahun_terbit

    @property
    def is_dipinjam(self):
        """Status peminjaman item: True jika sedang dipinjam."""
        return self._dipinjam

    @is_dipinjam.setter
    def is_dipinjam(self, nilai):
        """Mengubah status peminjaman; hanya menerima nilai boolean."""
        if not isinstance(nilai, bool):
            raise TypeError("is_dipinjam hanya menerima nilai True/False.")
        self._dipinjam = nilai

    @abstractmethod
    def get_detail(self):
        """Mengembalikan string berisi detail lengkap item ini."""
        raise NotImplementedError

    @abstractmethod
    def hitung_denda(self, hari_terlambat):
        """Menghitung denda (Rp) untuk keterlambatan sejumlah hari."""
        raise NotImplementedError

    def status(self):
        """Mengembalikan teks status ketersediaan item."""
        return "Dipinjam" if self._dipinjam else "Tersedia"


class Book(LibraryItem):
    """Subclass untuk buku. Denda Rp1.000 per hari keterlambatan."""

    DENDA_PER_HARI = 1000

    def __init__(self, item_id, judul, tahun_terbit, penulis, jumlah_halaman):
        """Membuat buku; memanggil constructor parent class (super)."""
        super().__init__(item_id, judul, tahun_terbit)
        self.__penulis = penulis
        self.__jumlah_halaman = jumlah_halaman

    @property
    def penulis(self):
        """Nama penulis buku (read-only)."""
        return self.__penulis

    @property
    def jumlah_halaman(self):
        """Jumlah halaman buku (read-only)."""
        return self.__jumlah_halaman

    def get_detail(self):
        """Detail buku: judul, penulis, tahun, dan jumlah halaman."""
        return (f"[Buku] {self.judul} | Penulis: {self.penulis} | "
                f"Tahun: {self.tahun_terbit} | {self.jumlah_halaman} hlm")

    def hitung_denda(self, hari_terlambat):
        """Denda buku: Rp1.000 x jumlah hari terlambat."""
        if hari_terlambat <= 0:
            return 0
        return hari_terlambat * self.DENDA_PER_HARI


class Magazine(LibraryItem):
    """Subclass untuk majalah. Denda Rp500 per hari keterlambatan."""

    DENDA_PER_HARI = 500

    def __init__(self, item_id, judul, tahun_terbit, edisi, bulan_terbit):
        """Membuat majalah; memanggil constructor parent class (super)."""
        super().__init__(item_id, judul, tahun_terbit)
        self.__edisi = edisi
        self.__bulan_terbit = bulan_terbit

    @property
    def edisi(self):
        """Nomor edisi majalah (read-only)."""
        return self.__edisi

    @property
    def bulan_terbit(self):
        """Bulan terbit majalah (read-only)."""
        return self.__bulan_terbit

    def get_detail(self):
        """Detail majalah: judul, edisi, bulan, dan tahun terbit."""
        return (f"[Majalah] {self.judul} | Edisi: {self.edisi} | "
                f"Terbit: {self.bulan_terbit} {self.tahun_terbit}")

    def hitung_denda(self, hari_terlambat):
        """Denda majalah: Rp500 x jumlah hari terlambat."""
        if hari_terlambat <= 0:
            return 0
        return hari_terlambat * self.DENDA_PER_HARI
