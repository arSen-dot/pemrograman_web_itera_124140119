"""Inisialisasi database: buat tabel dan isi 3 data mata kuliah awal.

Penggunaan (setelah migrasi Alembic):
    python scripts/initialize_db.py development.ini

Untuk pengujian lokal tanpa PostgreSQL:
    python scripts/initialize_db.py test.ini
"""

import sys

from pyramid.paster import get_appsettings, setup_logging
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

from pyramid_mahasiswa.models import Base, Matakuliah

DATA_AWAL = [
    {'kode_mk': 'IF2110', 'nama_mk': 'Pemrograman Web',
     'sks': 3, 'semester': 5},
    {'kode_mk': 'IF3140', 'nama_mk': 'Basis Data',
     'sks': 4, 'semester': 3},
    {'kode_mk': 'IF3152', 'nama_mk': 'Sistem Informasi',
     'sks': 3, 'semester': 5},
]


def main(argv=sys.argv):
    """Isi database dengan 3 data mata kuliah awal (idempotent)."""
    if len(argv) < 2:
        print('Penggunaan: python scripts/initialize_db.py <file .ini>')
        sys.exit(1)
    config_uri = argv[1]
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)
    engine = engine_from_config(settings, 'sqlalchemy.')
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine)
    with session_factory() as session:
        for data in DATA_AWAL:
            sudah_ada = session.query(Matakuliah).filter_by(
                kode_mk=data['kode_mk']).first()
            if sudah_ada is None:
                session.add(Matakuliah(**data))
        session.commit()
    print('Database terisi {} data mata kuliah awal.'.format(len(DATA_AWAL)))


if __name__ == '__main__':
    main()
