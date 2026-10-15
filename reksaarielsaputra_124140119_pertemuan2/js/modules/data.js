// js/modules/data.js — model data & seed awal

/** Class: satu item tugas. Mendemonstrasikan Classes + default parameters. */
export class TaskItem {
  constructor({ id, title, deadline = '', priority = 'sedang', done = false, createdAt = Date.now() } = {}) {
    this.id = id;
    this.title = title;
    this.deadline = deadline;
    this.priority = priority;
    this.done = done;
    this.createdAt = createdAt;
  }

  /** Kembalikan salinan dengan status selesai dibalik (immutable update) */
  toggled() {
    return new TaskItem({ ...this, done: !this.done });
  }

  /** True jika ada deadline dan sudah lewat tapi belum selesai */
  get isOverdue() {
    if (!this.deadline || this.done) return false;
    return new Date(this.deadline) < new Date();
  }
}

/** Label prioritas untuk badge */
export const PRIORITY_LABEL = { tinggi: 'Tinggi', sedang: 'Sedang', rendah: 'Rendah' };

/** Contoh jadwal awal (bisa dihapus/diubah pengguna) */
export const SEED_JADWAL = [
  { hari: 'Senin', matkul: 'Pengembangan Aplikasi Web', mulai: '10:00', selesai: '12:30', ruangan: 'Lab 2' },
  { hari: 'Rabu', matkul: 'Jaringan Komputer', mulai: '08:00', selesai: '10:30', ruangan: 'R. 3.2' },
  { hari: 'Jumat', matkul: 'Inteligensi Buatan', mulai: '13:00', selesai: '15:30', ruangan: 'R. 2.1' },
];

/** Contoh catatan awal */
export const SEED_CATATAN = [
  {
    title: 'Selamat datang!',
    body: 'Ini catatan contoh. Kamu bisa menambah, mengedit, dan menghapus catatan. Semua tersimpan otomatis di localStorage browser.',
  },
];
