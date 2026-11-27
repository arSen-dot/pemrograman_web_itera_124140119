"""Model ORM Matakuliah untuk Praktikum PAW Pertemuan 6."""

from pyramid_mahasiswa.models import Base
from sqlalchemy import Column, Integer, Text


class Matakuliah(Base):
    """Tabel matakuliah: data mata kuliah program studi Informatika."""

    __tablename__ = 'matakuliah'

    id = Column(Integer, primary_key=True, autoincrement=True)
    kode_mk = Column(Text, unique=True, nullable=False)
    nama_mk = Column(Text, nullable=False)
    sks = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)

    def to_dict(self):
        """Serialisasi objek menjadi dictionary JSON."""
        return {
            'id': self.id,
            'kode_mk': self.kode_mk,
            'nama_mk': self.nama_mk,
            'sks': self.sks,
            'semester': self.semester,
        }
