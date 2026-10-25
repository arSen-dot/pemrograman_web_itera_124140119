import PropTypes from 'prop-types';
import './BookList.css';

// Label status yang tampil sebagai badge di tiap kartu buku.
const STATUS_LABELS = {
  milik: 'Milik',
  baca: 'Sedang Dibaca',
  beli: 'Ingin Dibeli',
};

/**
 * BookList: menampilkan daftar buku sebagai kartu.
 * Setiap kartu punya tombol Ubah dan Hapus.
 */
export function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty">Belum ada buku yang cocok. Tambahkan buku baru di atas.</p>;
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id} className="book-card">
          <div className="book-info">
            <strong className="book-title">{book.title}</strong>
            <span className="book-author">{book.author}</span>
          </div>
          <span className={`badge status-${book.status}`}>
            {STATUS_LABELS[book.status] ?? book.status}
          </span>
          <div className="book-actions">
            <button type="button" className="btn small" onClick={() => onEdit(book)}>
              Ubah
            </button>
            <button type="button" className="btn small danger" onClick={() => onDelete(book.id)}>
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
