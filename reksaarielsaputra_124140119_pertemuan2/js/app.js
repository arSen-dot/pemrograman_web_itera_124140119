// js/app.js — class utama aplikasi (diimpor oleh js/main.js)

import { $, uid, escapeHtml, formatTanggal, formatTanggalJam, HARI } from './modules/utils.js';
import { TaskItem, PRIORITY_LABEL, SEED_JADWAL, SEED_CATATAN } from './modules/data.js';
import { iconDashboard, iconCalendar, iconTodo, iconNote, iconClock, iconPin, iconPencil, iconTrash, cuacaIcon } from './modules/icons.js';

/** Class: mengelola state, localStorage, dan fetch data eksternal. */
export class DashboardApp {
  constructor(storageKey = 'paw_dashboard_v1') {
    this.storageKey = storageKey;
    this.state = { jadwal: [], tugas: [], catatan: [] };
    this.filterTugas = 'semua';
    this.query = ''; // kata kunci pencarian dari topbar
  }

  /** Inisialisasi: muat data lokal, seed bila kosong, ambil API paralel. */
  async init() {
    this.load();
    if (this.state.tugas.length === 0) await this.seedTugas();
    // Ambil cuaca & kutipan secara paralel; kegagalan satu tidak menggagalkan lainnya
    const [cuaca, kutip] = await Promise.allSettled([this.fetchCuaca(), this.fetchKutipan()]);
    if (cuaca.status === 'fulfilled') this.renderCuaca(cuaca.value);
    if (kutip.status === 'fulfilled') this.renderKutipan(kutip.value);
    this.renderAll();
  }

  // ---------- Penyimpanan lokal ----------

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Hydrate tugas menjadi instance TaskItem agar method-nya tersedia
        this.state = {
          jadwal: parsed.jadwal ?? [],
          tugas: (parsed.tugas ?? []).map((t) => new TaskItem(t)),
          catatan: parsed.catatan ?? [],
        };
        return;
      }
    } catch { /* abaikan data rusak, pakai seed */ }
    // Seed awal untuk pengguna baru
    this.state.jadwal = SEED_JADWAL.map((j) => ({ id: uid(), ...j }));
    this.state.catatan = SEED_CATATAN.map((c) => ({ id: uid(), updatedAt: Date.now(), ...c }));
    this.save();
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  // ---------- Operasi async (fetch API publik) ----------

  /** Cuaca ITERA via Open-Meteo (async/await) */
  async fetchCuaca() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current=temperature_2m,weather_code&timezone=Asia%2FJakarta';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Cuaca gagal dimuat');
    const { current } = await res.json(); // destructuring
    return current;
  }

  /** Kutipan harian via DummyJSON (async/await) */
  async fetchKutipan() {
    const res = await fetch('https://dummyjson.com/quotes/random');
    if (!res.ok) throw new Error('Kutipan gagal dimuat');
    return res.json();
  }

  /** Seed tugas dari JSONPlaceholder saat pertama kali (Promise) */
  seedTugas() {
    return fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((res) => {
        if (!res.ok) throw new Error('Seed gagal');
        return res.json();
      })
      .then((todos) => {
        this.state.tugas = todos.map(
          ({ id, title, completed }) => // destructuring di parameter arrow function
            new TaskItem({ id: uid(), title, done: completed, priority: 'sedang' })
        );
        this.save();
      })
      .catch(() => { /* offline: biarkan kosong */ });
  }

  // ---------- CRUD Jadwal (immutable via spread) ----------

  tambahJadwal(data) {
    this.state = { ...this.state, jadwal: [...this.state.jadwal, { id: uid(), ...data }] };
    this.save(); this.renderAll();
  }

  ubahJadwal(id, patch) {
    this.state = {
      ...this.state,
      jadwal: this.state.jadwal.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    };
    this.save(); this.renderAll();
  }

  hapusJadwal(id) {
    this.state = { ...this.state, jadwal: this.state.jadwal.filter((j) => j.id !== id) };
    this.save(); this.renderAll();
  }

  // ---------- CRUD Tugas ----------

  tambahTugas(data) {
    const item = new TaskItem({ id: uid(), ...data });
    this.state = { ...this.state, tugas: [item, ...this.state.tugas] };
    this.save(); this.renderAll();
  }

  ubahTugas(id, patch) {
    this.state = {
      ...this.state,
      tugas: this.state.tugas.map((t) =>
        t.id === id ? new TaskItem({ ...t, ...patch }) : t
      ),
    };
    this.save(); this.renderAll();
  }

  toggleTugas(id) {
    this.state = {
      ...this.state,
      tugas: this.state.tugas.map((t) => (t.id === id ? t.toggled() : t)),
    };
    this.save(); this.renderAll();
  }

  hapusTugas(id) {
    this.state = { ...this.state, tugas: this.state.tugas.filter((t) => t.id !== id) };
    this.save(); this.renderAll();
  }

  // ---------- CRUD Catatan ----------

  tambahCatatan(data) {
    this.state = {
      ...this.state,
      catatan: [{ id: uid(), updatedAt: Date.now(), ...data }, ...this.state.catatan],
    };
    this.save(); this.renderAll();
  }

  ubahCatatan(id, patch) {
    this.state = {
      ...this.state,
      catatan: this.state.catatan.map((c) =>
        c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c
      ),
    };
    this.save(); this.renderAll();
  }

  hapusCatatan(id) {
    this.state = { ...this.state, catatan: this.state.catatan.filter((c) => c.id !== id) };
    this.save(); this.renderAll();
  }

  // ---------- Render (template literals + array methods) ----------

  renderCuaca(current) {
    const [label, ico] = cuacaIcon(current.weather_code);
    const chip = $('#weatherChip');
    if (chip) chip.innerHTML = `${Math.round(current.temperature_2m)}°C ${ico} ${label} · ITERA`;
  }

  renderKutipan({ quote, author }) {
    this._kutipan = { quote, author }; // dirender di widget dashboard
  }

  /** Cocokkan item dengan kata kunci pencarian topbar */
  matches(item, fields) {
    const q = this.query.trim().toLowerCase();
    if (!q) return true;
    return fields.some((f) => String(item[f] ?? '').toLowerCase().includes(q));
  }

  /** Widget-widget overview ala PMS */
  renderDashboard() {
    const total = this.state.tugas.length;
    const selesai = this.state.tugas.filter((t) => t.done).length;
    const aktif = total - selesai;
    const persen = total === 0 ? 0 : Math.round((selesai / total) * 100);
    const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const jadwalHariIni = this.state.jadwal.filter((j) => j.hari === hariIni);
    const tugasAktif = this.state.tugas.filter((t) => !t.done).slice(0, 5);
    const catatanBaru = [...this.state.catatan].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
    const kutip = this._kutipan;

    $('#dashWidgets').innerHTML = `
      <div class="widget">
        <h3>Progres Tugas</h3>
        <div class="pbar-label"><span>Selesai ${selesai}/${total}</span><span>${persen}%</span></div>
        <div class="pbar"><div style="width:${persen}%"></div></div>
        <div class="wrow" style="margin-top:.6rem"><span>${iconCalendar()} Jadwal hari ini</span><span class="badge badge-todo">${jadwalHariIni.length}</span></div>
        <div class="wrow"><span>${iconClock()} Tugas aktif</span><span class="badge badge-pending">${aktif} pending</span></div>
        <div class="wrow"><span>${iconNote()} Catatan</span><span class="badge badge-todo">${this.state.catatan.length}</span></div>
      </div>
      <div class="widget">
        <h3>Jadwal Hari Ini</h3>
        ${jadwalHariIni.length === 0
          ? `<p class="quote-box">Tidak ada jadwal hari ini.</p>`
          : jadwalHariIni.map((j) => `
            <div class="wrow"><span><strong>${escapeHtml(j.matkul)}</strong><br>
            <small style="color:var(--muted)">🕐 ${escapeHtml(j.mulai)}–${escapeHtml(j.selesai)}${j.ruangan ? ` · 📍 ${escapeHtml(j.ruangan)}` : ''}</small></span></div>`).join('')}
      </div>
      <div class="widget">
        <h3>Tugas Aktif</h3>
        ${tugasAktif.length === 0
          ? `<p class="quote-box">Semua tugas beres!</p>`
          : tugasAktif.map((t) => `
            <div class="wrow"><span>${escapeHtml(t.title)}</span>
            <span class="badge ${t.isOverdue ? 'badge-tinggi' : 'badge-pending'}">${t.isOverdue ? 'Terlambat' : 'Pending'}</span></div>`).join('')}
      </div>
      <div class="widget">
        <h3>Catatan Terbaru</h3>
        ${catatanBaru.length === 0
          ? `<p class="quote-box">Belum ada catatan.</p>`
          : catatanBaru.map((c) => `
            <div class="wrow"><span><strong>${escapeHtml(c.title)}</strong><br>
            <small style="color:var(--muted)">${escapeHtml(c.body.slice(0, 60))}${c.body.length > 60 ? '…' : ''}</small></span></div>`).join('')}
      </div>
      ${kutip ? `
      <div class="widget">
        <h3>Kutipan Hari Ini</h3>
        <p class="quote-box">“${escapeHtml(kutip.quote)}”<br>— ${escapeHtml(kutip.author)}</p>
      </div>` : ''}`;
  }

  renderJadwal() {
    const q = this.query.trim().toLowerCase();
    const urutan = Object.fromEntries(HARI.map((h, i) => [h, i]));
    const sorted = [...this.state.jadwal]
      .filter((j) => this.matches(j, ['matkul', 'hari', 'ruangan']))
      .sort((a, b) => urutan[a.hari] - urutan[b.hari] || a.mulai.localeCompare(b.mulai));
    $('#jadwalList').innerHTML = sorted.length === 0
      ? `<div class="empty">${q ? `Tidak ada hasil untuk “${escapeHtml(this.query)}”.` : 'Belum ada jadwal. Klik “＋ Add”.'}</div>`
      : sorted.map((j) => `
        <div class="card flex flex-wrap items-center gap-3">
          <div class="badge badge-todo">${escapeHtml(j.hari)}</div>
          <div class="flex-1 min-w-[180px]">
            <div class="font-bold">${escapeHtml(j.matkul)}</div>
            <div class="text-sm text-slate-500">${iconClock()} ${escapeHtml(j.mulai)}–${escapeHtml(j.selesai)}${j.ruangan ? ` ${iconPin()} ${escapeHtml(j.ruangan)}` : ''}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn-ghost" data-action="edit" data-kind="jadwal" data-id="${j.id}">${iconPencil()} Ubah</button>
            <button class="btn-danger" data-action="hapus" data-id="${j.id}" data-kind="jadwal">${iconTrash()}</button>
          </div>
        </div>`).join('');
  }

  renderTugas() {
    let list = [...this.state.tugas].filter((t) => this.matches(t, ['title']));
    if (this.filterTugas === 'aktif') list = list.filter((t) => !t.done);
    if (this.filterTugas === 'selesai') list = list.filter((t) => t.done);
    list.sort((a, b) => a.done - b.done || b.createdAt - a.createdAt);
    $('#tugasList').innerHTML = list.length === 0
      ? `<div class="empty">Tidak ada tugas di sini.</div>`
      : list.map((t) => `
        <div class="card flex flex-wrap items-center gap-3 ${t.done ? 'opacity-60' : ''}">
          <input type="checkbox" ${t.done ? 'checked' : ''} data-action="toggle" data-id="${t.id}" class="w-5 h-5 cursor-pointer" style="accent-color:var(--blue)">
          <div class="flex-1 min-w-[180px]">
            <div class="font-bold ${t.done ? 'line-through' : ''}">${escapeHtml(t.title)}</div>
            <div class="text-sm text-slate-500">
              ${t.deadline ? `${iconCalendar()} ${formatTanggal(t.deadline)}` : 'Tanpa deadline'}
            </div>
          </div>
          <span class="badge ${t.done ? 'badge-done' : t.isOverdue ? 'badge-tinggi' : 'badge-pending'}">${t.done ? 'Done' : t.isOverdue ? 'Terlambat' : 'Pending'}</span>
          <span class="badge badge-${t.priority}">${PRIORITY_LABEL[t.priority]}</span>
          <div class="flex gap-2">
            <button class="btn-ghost" data-action="edit" data-kind="tugas" data-id="${t.id}">${iconPencil()} Ubah</button>
            <button class="btn-danger" data-action="hapus" data-id="${t.id}" data-kind="tugas">${iconTrash()}</button>
          </div>
        </div>`).join('');
    // badge lonceng = jumlah tugas aktif
    const aktif = this.state.tugas.filter((t) => !t.done).length;
    const bell = $('#bellBadge');
    if (bell) {
      bell.textContent = aktif;
      bell.classList.toggle('hidden', aktif === 0);
    }
  }

  renderCatatan() {
    const sorted = [...this.state.catatan]
      .filter((c) => this.matches(c, ['title', 'body']))
      .sort((a, b) => b.updatedAt - a.updatedAt);
    $('#catatanList').innerHTML = sorted.length === 0
      ? `<div class="empty">Belum ada catatan.</div>`
      : sorted.map((c) => `
        <div class="card">
          <div class="font-bold mb-1">${escapeHtml(c.title)}</div>
          <p class="text-sm text-slate-600 whitespace-pre-wrap mb-2">${escapeHtml(c.body)}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">${formatTanggalJam(c.updatedAt)}</span>
            <div class="flex gap-2">
              <button class="btn-ghost" data-action="edit" data-kind="catatan" data-id="${c.id}">${iconPencil()} Ubah</button>
              <button class="btn-danger" data-action="hapus" data-id="${c.id}" data-kind="catatan">${iconTrash()}</button>
            </div>
          </div>
        </div>`).join('');
  }

  renderAll() {
    this.renderDashboard();
    this.renderJadwal();
    this.renderTugas();
    this.renderCatatan();
  }
}
