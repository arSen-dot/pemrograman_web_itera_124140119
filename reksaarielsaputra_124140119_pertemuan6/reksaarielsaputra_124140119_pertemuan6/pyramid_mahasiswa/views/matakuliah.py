"""Views CRUD Matakuliah (REST API JSON)."""

from pyramid.view import view_config
from sqlalchemy.exc import IntegrityError

from ..models import Matakuliah


def _cari_matakuliah(request):
    """Cari matakuliah berdasarkan id di URL, None bila tidak ada."""
    try:
        matakuliah_id = int(request.matchdict['id'])
    except (KeyError, ValueError):
        return None
    return request.db.query(Matakuliah).get(matakuliah_id)


def _baca_json(request):
    """Baca body JSON, kembalikan (data, pesan_error)."""
    try:
        return request.json_body, None
    except ValueError:
        return None, 'Body harus berupa JSON yang valid.'


def _validasi_payload(data):
    """Validasi field wajib dan nilai sks/semester.

    Mengembalikan pesan error (string) atau None bila valid.
    """
    for field in ('kode_mk', 'nama_mk', 'sks', 'semester'):
        if field not in data or data[field] in (None, ''):
            return 'Field {} wajib diisi.'.format(field)
    for field in ('sks', 'semester'):
        nilai = data[field]
        if isinstance(nilai, bool) or not isinstance(nilai, int):
            return 'Field {} harus bilangan bulat.'.format(field)
        if nilai <= 0:
            return 'Field {} harus lebih dari 0.'.format(field)
    return None


@view_config(route_name='matakuliah_list', request_method='GET',
             renderer='json')
def daftar_matakuliah(request):
    """GET /api/matakuliah — tampilkan seluruh daftar mata kuliah."""
    semua = request.db.query(Matakuliah).order_by(Matakuliah.id).all()
    return [mk.to_dict() for mk in semua]


@view_config(route_name='matakuliah_detail', request_method='GET',
             renderer='json')
def detail_matakuliah(request):
    """GET /api/matakuliah/{id} — detail satu mata kuliah (404 bila kosong)."""
    matakuliah = _cari_matakuliah(request)
    if matakuliah is None:
        request.response.status = 404
        return {'error': 'Matakuliah tidak ditemukan.'}
    return matakuliah.to_dict()


@view_config(route_name='matakuliah_create', request_method='POST',
             renderer='json')
def tambah_matakuliah(request):
    """POST /api/matakuliah — tambah mata kuliah baru.

    Kembalikan 400 bila field wajib tidak lengkap.
    """
    data, error = _baca_json(request)
    if error is not None:
        request.response.status = 400
        return {'error': error}
    error = _validasi_payload(data)
    if error is not None:
        request.response.status = 400
        return {'error': error}
    matakuliah = Matakuliah(
        kode_mk=data['kode_mk'],
        nama_mk=data['nama_mk'],
        sks=data['sks'],
        semester=data['semester'],
    )
    request.db.add(matakuliah)
    try:
        request.db.flush()
        request.db.commit()
    except IntegrityError:
        request.db.rollback()
        request.response.status = 400
        return {'error': 'kode_mk sudah terdaftar.'}
    request.response.status = 201
    return matakuliah.to_dict()


@view_config(route_name='matakuliah_update', request_method='PUT',
             renderer='json')
def ubah_matakuliah(request):
    """PUT /api/matakuliah/{id} — perbarui mata kuliah yang ada."""
    matakuliah = _cari_matakuliah(request)
    if matakuliah is None:
        request.response.status = 404
        return {'error': 'Matakuliah tidak ditemukan.'}
    data, error = _baca_json(request)
    if error is not None:
        request.response.status = 400
        return {'error': error}
    error = _validasi_payload(data)
    if error is not None:
        request.response.status = 400
        return {'error': error}
    matakuliah.kode_mk = data['kode_mk']
    matakuliah.nama_mk = data['nama_mk']
    matakuliah.sks = data['sks']
    matakuliah.semester = data['semester']
    try:
        request.db.flush()
        request.db.commit()
    except IntegrityError:
        request.db.rollback()
        request.response.status = 400
        return {'error': 'kode_mk sudah terdaftar.'}
    return matakuliah.to_dict()


@view_config(route_name='matakuliah_delete', request_method='DELETE',
             renderer='json')
def hapus_matakuliah(request):
    """DELETE /api/matakuliah/{id} — hapus mata kuliah berdasarkan ID."""
    matakuliah = _cari_matakuliah(request)
    if matakuliah is None:
        request.response.status = 404
        return {'error': 'Matakuliah tidak ditemukan.'}
    kode = matakuliah.kode_mk
    request.db.delete(matakuliah)
    request.db.commit()
    return {'message': 'Matakuliah {} berhasil dihapus.'.format(kode)}
