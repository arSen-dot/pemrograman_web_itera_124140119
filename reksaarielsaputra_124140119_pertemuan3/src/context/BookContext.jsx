import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Kunci penyimpanan di localStorage dan data contoh saat pertama dibuka.
const STORAGE_KEY = 'paw3-books';

const SEED_BOOKS = [
  { id: 'seed-1', title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'milik' },
  { id: 'seed-2', title: 'Bumi', author: 'Tere Liye', status: 'baca' },
  { id: 'seed-3', title: 'Clean Code', author: 'Robert C. Martin', status: 'beli' },
];

// Context untuk state global daftar buku.
const BookContext = createContext(null);

/**
 * Provider: menyimpan daftar buku di localStorage (via useLocalStorage)
 * dan menyediakan fungsi tambah / ubah / hapus ke seluruh aplikasi.
 */
export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage(STORAGE_KEY, SEED_BOOKS);

  // Tambah buku baru dengan id unik.
  const addBook = (book) => {
    const newBook = { ...book, id: `book-${Date.now()}-${Math.floor(Math.random() * 10000)}` };
    setBooks((prev) => [...prev, newBook]);
  };

  // Ubah buku berdasarkan id (field lain dipertahankan).
  const updateBook = (id, updatedFields) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)));
  };

  // Hapus buku berdasarkan id.
  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook pembantu agar komponen cukup memanggil useBooks()
 * tanpa harus import useContext + BookContext manual.
 */
export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks harus dipakai di dalam <BookProvider>');
  return ctx;
}
