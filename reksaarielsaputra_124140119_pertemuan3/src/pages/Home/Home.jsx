import { useState, useMemo } from 'react';
import { useBooks } from '../../context/BookContext';
import { BookForm } from '../../components/BookForm/BookForm';
import { BookList } from '../../components/BookList/BookList';
import { BookFilter } from '../../components/BookFilter/BookFilter';
import './Home.css';

/**
 * Home: halaman utama berisi daftar buku.
 * - search & statusFilter: state lokal untuk pencarian dan filter.
 * - editingBook: buku yang sedang diubah (null = mode tambah).
 * - Daftar tampil dihitung dengan useMemo agar filter hanya
 *   dihitung ulang saat books/search/statusFilter berubah.
 */
export function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [editingBook, setEditingBook] = useState(null);

  // Terapkan pencarian (judul/penulis) + filter status.
  const visibleBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchQuery =
        q === '' ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'semua' || book.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [books, search, statusFilter]);

  const handleSubmit = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
      setEditingBook(null);
    } else {
      addBook(data);
    }
  };

  const handleDelete = (id) => {
    // Konfirmasi sederhana sebelum menghapus.
    if (window.confirm('Hapus buku ini dari koleksi?')) deleteBook(id);
  };

  return (
    <div className="page home-page">
      <h2>Koleksi Bukuku</h2>

      <BookForm
        initialBook={editingBook}
        onSubmit={handleSubmit}
        onCancel={editingBook ? () => setEditingBook(null) : null}
      />

      <BookFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <p className="result-count">
        Menampilkan {visibleBooks.length} dari {books.length} buku
      </p>

      <BookList books={visibleBooks} onEdit={setEditingBook} onDelete={handleDelete} />
    </div>
  );
}
