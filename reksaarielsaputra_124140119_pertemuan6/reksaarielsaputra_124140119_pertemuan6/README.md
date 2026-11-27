# Praktikum PAW — Pertemuan 6: Manajemen Matakuliah (Pyramid + PostgreSQL)

**Nama:** Reksa Ariel Saputra
**NIM:** 124140119
**Kelas Praktikum:** RB

## Deskripsi Program

Aplikasi RESTful API Manajemen Data Matakuliah berbasis Pyramid dan
PostgreSQL, lanjutan dari aplikasi Pyramid yang dibuat pada praktikum ini.
Aplikasi menerapkan arsitektur yang dipelajari: model data ORM, migrasi
Alembic, routing URL Dispatch, dan view controller CRUD.

### Model data (`pyramid_mahasiswa/models/matakuliah.py`)

Tabel `matakuliah`:

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | Integer, Primary Key, Autoincrement | ID mata kuliah |
| `kode_mk` | Text, Unique, Not Null | Contoh: `IF2110`, `IF3140` |
| `nama_mk` | Text, Not Null | Contoh: `Pemrograman Web`, `Basis Data` |
| `sks` | Integer, Not Null | Harus bilangan bulat lebih dari 0 |
| `semester` | Integer, Not Null | Harus bilangan bulat lebih dari 0 |

Method `to_dict()` mengubah objek menjadi dictionary JSON. Model
didaftarkan di `pyramid_mahasiswa/models/__init__.py`.

### Migrasi Alembic

Revisi `a1b2c3d4e5f6_create_matakuliah_table.py` membuat tabel
`matakuliah` (dibuat dengan
`alembic revision --autogenerate -m "create matakuliah table"` lalu
diterapkan dengan `alembic upgrade head`).

### Seeding

`scripts/initialize_db.py` mengisi 3 data awal (idempotent — data yang
sudah ada tidak diduplikasi):

| kode_mk | nama_mk | sks | semester |
| --- | --- | --- | --- |
| IF2110 | Pemrograman Web | 3 | 5 |
| IF3140 | Basis Data | 4 | 3 |
| IF3152 | Sistem Informasi | 3 | 5 |

### Struktur berkas

- `pyramid_mahasiswa/__init__.py` — factory aplikasi `main()`, session
  SQLAlchemy per request.
- `pyramid_mahasiswa/routes.py` — kelima route CRUD dengan predikat
  `request_method`.
- `pyramid_mahasiswa/models/__init__.py` — registrasi model `Matakuliah`.
- `pyramid_mahasiswa/models/matakuliah.py` — model ORM + `to_dict()`.
- `pyramid_mahasiswa/views/matakuliah.py` — 5 view CRUD + validasi.
- `alembic.ini`, `alembic/env.py`,
  `alembic/versions/a1b2c3d4e5f6_create_matakuliah_table.py` — migrasi.
- `scripts/initialize_db.py` — seeding 3 data awal.
- `seed.py` — jalan pintas seeding (`python seed.py`).
- `development.ini` — konfigurasi PostgreSQL (default).
- `test.ini` — konfigurasi pengujian SQLite (tanpa PostgreSQL).
- `requirements.txt`, `setup.py` — dependensi dan instalasi paket.
- `pengujian-api.log` — log lengkap pengujian cURL.
- `screenshots/` — screenshot hasil pengujian API.

## Cara Instalasi

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .
```

Di Windows, kalau `python` tidak dikenali, pakai `py` atau `python3`.

## Konfigurasi Database (PostgreSQL)

1. Buat database PostgreSQL:

```sql
CREATE DATABASE paw_pertemuan6;
```

2. Sesuaikan `sqlalchemy.url` di `development.ini` dengan user dan
   password PostgreSQL lokal (default):

```ini
sqlalchemy.url = postgresql://postgres:postgres@localhost:5432/paw_pertemuan6
```

## Migrasi + Seed

```bash
alembic upgrade head
python scripts/initialize_db.py development.ini
```

Atau jalan pintas seeding:

```bash
python seed.py
```

## Cara Menjalankan Server

```bash
pserve development.ini
```

Server berjalan di http://127.0.0.1:6543.

## Daftar Endpoint

| Method | Endpoint | Fungsi | Status |
| --- | --- | --- | --- |
| GET | `/api/matakuliah` | Daftar seluruh mata kuliah | 200 |
| GET | `/api/matakuliah/{id}` | Detail satu mata kuliah | 200 / 404 |
| POST | `/api/matakuliah` | Tambah mata kuliah baru | 201 / 400 |
| PUT | `/api/matakuliah/{id}` | Perbarui mata kuliah | 200 / 400 / 404 |
| DELETE | `/api/matakuliah/{id}` | Hapus mata kuliah | 200 / 404 |

### Contoh request/response

Tambah mata kuliah:

```bash
curl -X POST http://127.0.0.1:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF2140","nama_mk":"Kecerdasan Buatan","sks":3,"semester":5}'
```

Respons (201):

```json
{"id": 4, "kode_mk": "IF2140", "nama_mk": "Kecerdasan Buatan", "sks": 3, "semester": 5}
```

Field wajib tidak lengkap (400):

```json
{"error": "Field sks wajib diisi."}
```

ID tidak ditemukan (404):

```json
{"error": "Matakuliah tidak ditemukan."}
```

Validasi: `kode_mk`, `nama_mk`, `sks`, dan `semester` wajib diisi;
`sks` dan `semester` harus bilangan bulat lebih dari 0; `kode_mk`
yang sudah terdaftar ditolak dengan 400.

## Hasil Pengujian

Pengujian dilakukan 26 November 2026 dengan cURL terhadap server yang
berjalan (11 kasus uji, semua lolos). Log lengkap: `pengujian-api.log`.

| # | Pengujian | Hasil |
| --- | --- | --- |
| 1 | GET `/api/matakuliah` (list) | 200 — 3 data seed |
| 2 | GET `/api/matakuliah/1` (detail) | 200 — IF2110 Pemrograman Web |
| 3 | GET `/api/matakuliah/99` (tidak ada) | 404 — Matakuliah tidak ditemukan. |
| 4 | POST tambah IF2140 Kecerdasan Buatan | 201 — id 4 |
| 5 | POST field tak lengkap (tanpa sks) | 400 — Field sks wajib diisi. |
| 6 | POST `sks: 0` | 400 — Field sks harus lebih dari 0. |
| 7 | PUT `/api/matakuliah/4` (sks 4, semester 6) | 200 — data terperbarui |
| 8 | PUT `/api/matakuliah/99` (tidak ada) | 404 — Matakuliah tidak ditemukan. |
| 9 | DELETE `/api/matakuliah/4` | 200 — Matakuliah IF2140 berhasil dihapus. |
| 10 | DELETE `/api/matakuliah/4` lagi | 404 — Matakuliah tidak ditemukan. |
| 11 | GET `/api/matakuliah` (list akhir) | 200 — kembali 3 data seed |

### Screenshot pengujian

![Pengujian API — GET & POST](screenshots/pengujian-api-get-post.png)

![Pengujian API — PUT & DELETE](screenshots/pengujian-api-put-delete.png)
