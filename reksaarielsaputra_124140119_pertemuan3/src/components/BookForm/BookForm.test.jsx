import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookForm } from './BookForm';

describe('BookForm', () => {
  it('menampilkan pesan error saat submit dengan field kosong', () => {
    render(<BookForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));
    expect(screen.getByText('Judul wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('Penulis wajib diisi')).toBeInTheDocument();
  });

  it('tidak memanggil onSubmit saat validasi gagal', () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('memanggil onSubmit dengan data benar saat form valid', () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/laskar pelangi/i), {
      target: { value: 'Dilan' },
    });
    fireEvent.change(screen.getByPlaceholderText(/andrea hirata/i), {
      target: { value: 'Pidi Baiq' },
    });
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Dilan',
      author: 'Pidi Baiq',
      status: 'milik',
    });
  });

  it('mode edit menampilkan judul "Ubah Buku" dan data awal', () => {
    const book = { id: '1', title: 'Bumi', author: 'Tere Liye', status: 'baca' };
    render(<BookForm initialBook={book} onSubmit={vi.fn()} />);
    expect(screen.getByText('Ubah Buku')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bumi')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tere Liye')).toBeInTheDocument();
  });
});
