"""Registrasi model ORM aplikasi Pyramid Mahasiswa."""

from sqlalchemy.orm import declarative_base

Base = declarative_base()

from .matakuliah import Matakuliah  # noqa: E402

__all__ = ['Base', 'Matakuliah']
