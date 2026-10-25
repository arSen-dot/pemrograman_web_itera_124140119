import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookList } from './BookList';

const SAMPLE_BOOKS = [
  { id: '1', title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'milik' },
  { id: '2', title: 'Bumi', author: 'Tere Liye', status: 'baca' },
];

describe('BookList', () => {
  it('menampilkan judul dan penulis semua buku', () => {
    render(<BookList books={SAMPLE_BOOKS} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument();
    expect(screen.getByText('Andrea Hirata')).toBeInTheDocument();
    expect(screen.getByText('Tere Liye')).toBeInTheDocument();
  });

  it('memanggil onDelete dengan id yang benar saat tombol Hapus diklik', () => {
    const onDelete = vi.fn();
    render(<BookList books={SAMPLE_BOOKS} onEdit={vi.fn()} onDelete={onDelete} />);
    const hapusButtons = screen.getAllByRole('button', { name: /hapus/i });
    fireEvent.click(hapusButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('memanggil onEdit dengan data buku saat tombol Ubah diklik', () => {
    const onEdit = vi.fn();
    render(<BookList books={SAMPLE_BOOKS} onEdit={onEdit} onDelete={vi.fn()} />);
    const ubahButtons = screen.getAllByRole('button', { name: /ubah/i });
    fireEvent.click(ubahButtons[1]);
    expect(onEdit).toHaveBeenCalledWith(SAMPLE_BOOKS[1]);
  });

  it('menampilkan pesan kosong saat daftar buku kosong', () => {
    render(<BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/belum ada buku/i)).toBeInTheDocument();
  });
});
