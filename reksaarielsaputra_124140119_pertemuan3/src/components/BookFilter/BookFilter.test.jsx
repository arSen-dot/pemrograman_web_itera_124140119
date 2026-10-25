import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookFilter } from './BookFilter';

describe('BookFilter', () => {
  it('meneruskan perubahan teks pencarian ke parent', () => {
    const onSearchChange = vi.fn();
    render(
      <BookFilter
        search=""
        onSearchChange={onSearchChange}
        statusFilter="semua"
        onStatusFilterChange={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText(/cari buku/i), { target: { value: 'dilan' } });
    expect(onSearchChange).toHaveBeenCalledWith('dilan');
  });

  it('meneruskan perubahan filter status ke parent', () => {
    const onStatusFilterChange = vi.fn();
    render(
      <BookFilter
        search=""
        onSearchChange={vi.fn()}
        statusFilter="semua"
        onStatusFilterChange={onStatusFilterChange}
      />,
    );
    fireEvent.change(screen.getByLabelText(/filter status/i), { target: { value: 'baca' } });
    expect(onStatusFilterChange).toHaveBeenCalledWith('baca');
  });
});
