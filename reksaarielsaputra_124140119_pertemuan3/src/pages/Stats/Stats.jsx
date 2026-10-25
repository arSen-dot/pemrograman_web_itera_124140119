import { useBooks } from '../../context/BookContext';
import { useBookStats } from '../../hooks/useBookStats';
import './Stats.css';

/**
 * Stats: halaman statistik koleksi buku.
 * Memakai custom hook useBookStats untuk menghitung total
 * dan jumlah buku per status.
 */
export function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);

  const cards = [
    { label: 'Total Buku', value: stats.total },
    { label: 'Milik', value: stats.milik },
    { label: 'Sedang Dibaca', value: stats.baca },
    { label: 'Ingin Dibeli', value: stats.beli },
  ];

  return (
    <div className="page stats-page">
      <h2>Statistik Koleksi</h2>
      <div className="stat-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        ))}
      </div>
      {stats.total === 0 && <p className="empty">Belum ada data buku.</p>}
    </div>
  );
}
