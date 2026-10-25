import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import { Home } from './pages/Home/Home';
import { Stats } from './pages/Stats/Stats';
import './App.css';

/**
 * App: root aplikasi.
 * - BookProvider membungkus semuanya agar state buku (Context API)
 *   tersedia di semua halaman.
 * - React Router: "/" -> Home (daftar buku), "/stats" -> Stats.
 */
export default function App() {
  return (
    <BrowserRouter>
      <BookProvider>
        <div className="app">
          <header className="app-header">
            <h1>BukuKu</h1>
            <p className="tagline">Catat buku milikmu, yang sedang dibaca, dan yang ingin dibeli.</p>
            <nav className="app-nav">
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Koleksi
              </NavLink>
              <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active' : '')}>
                Statistik
              </NavLink>
            </nav>
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <small>Tugas Praktikum PAW Pertemuan 3 — Reksa Ariel Saputra (124140119)</small>
          </footer>
        </div>
      </BookProvider>
    </BrowserRouter>
  );
}
