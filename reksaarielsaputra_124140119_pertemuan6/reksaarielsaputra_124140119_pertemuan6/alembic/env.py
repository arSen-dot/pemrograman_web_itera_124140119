"""Konfigurasi environment Alembic untuk migrasi database."""

import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# noqa: E402 -- import model setelah config agar Base terisi
from pyramid_mahasiswa.models import Base

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _database_url():
    """URL database: env DATABASE_URL menang atas alembic.ini.

    Dipakai saat pengujian lokal dengan SQLite:
        DATABASE_URL=sqlite:///test.db alembic upgrade head
    """
    return os.environ.get('DATABASE_URL') or config.get_main_option(
        'sqlalchemy.url')


def run_migrations_offline():
    """Jalankan migrasi tanpa koneksi DB (mode offline)."""
    context.configure(
        url=_database_url(),
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Jalankan migrasi dengan koneksi DB (mode online)."""
    connectable = engine_from_config(
        {'sqlalchemy.url': _database_url()},
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection,
                          target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
