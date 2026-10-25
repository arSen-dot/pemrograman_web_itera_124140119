import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BookForm.css';

// Label status yang tampil di dropdown.
const STATUS_OPTIONS = [
  { value: 'milik', label: 'Milik' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
];

/**
 * BookForm: formulir tambah / edit buku.
 * - Mode tambah: initialBook = null.
 * - Mode edit: initialBook berisi data buku yang sedang diubah.
 * Validasi: judul & penulis wajib diisi, pesan error tampil di bawah field.
 */
export function BookForm({ initialBook, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('milik');
  // errors menyimpan pesan validasi per field, mis. { title: 'Judul wajib diisi' }.
  const [errors, setErrors] = useState({});

  // Saat masuk mode edit (initialBook berubah), isi form dengan data buku.
  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title ?? '');
      setAuthor(initialBook.author ?? '');
      setStatus(initialBook.status ?? 'milik');
    } else {
      setTitle('');
      setAuthor('');
      setStatus('milik');
    }
    setErrors({});
  }, [initialBook]);

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Judul wajib diisi';
    if (!author.trim()) next.author = 'Penulis wajib diisi';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; // berhenti kalau validasi gagal
    onSubmit({ title: title.trim(), author: author.trim(), status });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h3>{initialBook ? 'Ubah Buku' : 'Tambah Buku Baru'}</h3>

      <label className="field">
        <span>Judul</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="cth: Laskar Pelangi"
          className={errors.title ? 'invalid' : ''}
        />
        {errors.title && <em className="error">{errors.title}</em>}
      </label>

      <label className="field">
        <span>Penulis</span>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="cth: Andrea Hirata"
          className={errors.author ? 'invalid' : ''}
        />
        {errors.author && <em className="error">{errors.author}</em>}
      </label>

      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="form-actions">
        <button type="submit" className="btn primary">
          {initialBook ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  // Data buku saat mode edit; null saat mode tambah.
  initialBook: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

BookForm.defaultProps = {
  initialBook: null,
  onCancel: null,
};
