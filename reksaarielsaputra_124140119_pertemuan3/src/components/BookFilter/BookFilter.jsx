import PropTypes from 'prop-types';
import './BookFilter.css';

/**
 * BookFilter: kontrol pencarian (berdasar judul/penulis) dan
 * filter dropdown berdasar status. Komponen ini "controlled":
 * nilainya dipegang parent, ia hanya meneruskan perubahan.
 */
export function BookFilter({ search, onSearchChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="book-filter">
      <input
        type="search"
        className="search-input"
        placeholder="Cari judul atau penulis..."
        aria-label="Cari buku"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="status-select"
        aria-label="Filter status"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="semua">Semua Status</option>
        <option value="milik">Milik</option>
        <option value="baca">Sedang Dibaca</option>
        <option value="beli">Ingin Dibeli</option>
      </select>
    </div>
  );
}

BookFilter.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
};
