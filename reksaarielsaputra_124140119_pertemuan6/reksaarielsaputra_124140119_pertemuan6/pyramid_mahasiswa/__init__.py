"""Aplikasi Pyramid Mahasiswa — Manajemen Matakuliah."""

from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker


def _buka_session(request):
    """Buat session SQLAlchemy per request, tutup setelah selesai."""
    session = request.registry.session_factory()
    request.add_finished_callback(lambda req: session.close())
    return session


def main(global_config, **settings):
    """Buat aplikasi WSGI Pyramid dari konfigurasi .ini."""
    config = Configurator(settings=settings)
    engine = engine_from_config(settings, 'sqlalchemy.')
    config.registry.session_factory = sessionmaker(bind=engine)
    config.add_request_method(_buka_session, 'db', reify=True)
    config.include('.routes')
    config.scan('.views')
    return config.make_wsgi_app()
