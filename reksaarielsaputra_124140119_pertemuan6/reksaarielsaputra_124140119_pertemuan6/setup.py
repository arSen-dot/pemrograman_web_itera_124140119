"""Setup aplikasi Pyramid Mahasiswa (Praktikum PAW Pertemuan 6)."""

from setuptools import find_packages, setup

setup(
    name='pyramid_mahasiswa',
    version='1.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'pyramid',
        'SQLAlchemy',
        'alembic',
        'psycopg2-binary',
        'waitress',
    ],
    entry_points={
        'paste.app_factory': [
            'main = pyramid_mahasiswa:main',
        ],
    },
)
