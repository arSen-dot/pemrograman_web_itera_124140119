// js/main.js — entry point aplikasi (type="module")

import { $, escapeHtml, jamSekarang, hariIni, HARI } from './modules/utils.js';
import { DashboardApp } from './app.js';
import { PRIORITY_LABEL } from './modules/data.js';

const app = new DashboardApp();

/* ---------- Jam live (topbar) ---------- */
const tick = () => {
  const c = $('#clock');
  if (c) c.textContent = jamSekarang();
};
tick();
setInterval(tick, 1000);

/* ---------- Navigasi sidebar ---------- */
const showView = (name) => {
  document.querySelectorAll('.navbtn').forEach((b) => b.classList.toggle('active', b.dataset.view === name));
  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
  $(`#view-${name}`)?.classList.remove('hidden');
};

document.querySelector('.nav')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.navbtn');
  if (btn) showView(btn.dataset.view);
});

/* ---------- Pencarian topbar: filter daftar aktif ---------- */
$('#search')?.addEventListener('input', (e) => {
  app.query = e.target.value;
  app.renderAll();
});

/* ---------- Lonceng: lompat ke daftar tugas ---------- */
$('#bell')?.addEventListener('click', () => showView('tugas'));

/* ---------- Modal form generik ---------- */
const modal = $('#modal');
const modalForm = $('#modalForm');

const FIELDS = {
  jadwal: [
    { name: 'hari', label: 'Hari', type: 'select', options: HARI, required: true },
    { name: 'matkul', label: 'Mata kuliah', type: 'text', required: true, placeholder: 'cth: Jaringan Komputer' },
    { name: 'mulai', label: 'Jam mulai', type: 'time', required: true },
    { name: 'selesai', label: 'Jam selesai', type: 'time', required: true },
    { name: 'ruangan', label: 'Ruangan (opsional)', type: 'text', placeholder: 'cth: R. 3.2' },
  ],
  tugas: [
    { name: 'title', label: 'Judul tugas', type: 'text', required: true, placeholder: 'cth: Laporan Praktikum 4' },
    { name: 'deadline', label: 'Deadline', type: 'date' },
    { name: 'priority', label: 'Prioritas', type: 'select', options: Object.keys(PRIORITY_LABEL) },
  ],
  catatan: [
    { name: 'title', label: 'Judul', type: 'text', required: true, placeholder: 'cth: Ide proyek' },
    { name: 'body', label: 'Isi catatan', type: 'textarea', required: true, placeholder: 'Tulis catatanmu…' },
  ],
};

const TITLES = { jadwal: 'Jadwal Kuliah', tugas: 'Tugas', catatan: 'Catatan' };

const fieldHtml = (f, value = '') => {
  const v = escapeHtml(value ?? '');
  const req = f.required ? 'required' : '';
  if (f.type === 'select') {
    const opts = f.options.map((o) => `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`).join('');
    return `<label class="block text-sm font-medium">${f.label}<select name="${f.name}" class="input mt-1" ${req}>${opts}</select></label>`;
  }
  if (f.type === 'textarea') {
    return `<label class="block text-sm font-medium">${f.label}<textarea name="${f.name}" rows="4" class="input mt-1" ${req} placeholder="${f.placeholder ?? ''}">${v}</textarea></label>`;
  }
  return `<label class="block text-sm font-medium">${f.label}<input type="${f.type}" name="${f.name}" value="${v}" class="input mt-1" ${req} placeholder="${f.placeholder ?? ''}"></label>`;
};

let editing = null; // { kind, id } atau null saat tambah baru

const openModal = (kind, item = null) => {
  editing = item ? { kind, id: item.id } : { kind, id: null };
  $('#modalTitle').textContent = `${item ? 'Ubah' : 'Tambah'} ${TITLES[kind]}`;
  modalForm.innerHTML =
    FIELDS[kind].map((f) => fieldHtml(f, item?.[f.name])).join('') +
    `<div class="flex gap-2 pt-2">
       <button type="submit" class="btn-primary flex-1">Simpan</button>
       <button type="button" id="modalCancel" class="btn-ghost">Batal</button>
     </div>`;
  modal.classList.remove('hidden');
  $('#modalCancel').addEventListener('click', closeModal);
};

const closeModal = () => {
  modal.classList.add('hidden');
  editing = null;
};

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(modalForm).entries());
  const { kind, id } = editing;
  if (id) {
    // mode ubah
    if (kind === 'jadwal') app.ubahJadwal(id, data);
    else if (kind === 'tugas') app.ubahTugas(id, data);
    else app.ubahCatatan(id, data);
  } else {
    // mode tambah
    if (kind === 'jadwal') app.tambahJadwal(data);
    else if (kind === 'tugas') app.tambahTugas(data);
    else app.tambahCatatan(data);
  }
  closeModal();
});

/* ---------- Aksi global: tambah / edit / hapus / toggle (event delegation) ---------- */
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) {
    openModal(addBtn.dataset.add);
    return;
  }
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, id, kind } = el.dataset;

  if (action === 'hapus') {
    if (!confirm('Hapus item ini?')) return;
    if (kind === 'jadwal') app.hapusJadwal(id);
    else if (kind === 'tugas') app.hapusTugas(id);
    else app.hapusCatatan(id);
    return;
  }
  if (action === 'toggle') {
    app.toggleTugas(id);
    return;
  }
  if (action === 'edit') {
    const item =
      kind === 'jadwal' ? app.state.jadwal.find((j) => j.id === id)
      : kind === 'tugas' ? app.state.tugas.find((t) => t.id === id)
      : app.state.catatan.find((c) => c.id === id);
    if (item) openModal(kind, item);
  }
});

/* ---------- Filter tugas ---------- */
$('#filterTugas')?.addEventListener('change', (e) => {
  app.filterTugas = e.target.value;
  app.renderTugas();
});

/* ---------- Sambutan hari ini ---------- */
const sambutan = () => {
  const h = new Date().getHours();
  const sapa = h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam';
  document.title = `${sapa}! — Personal Dashboard`;
};

/* ---------- Jalan! ---------- */
sambutan();
app.init().catch(() => app.renderAll());
