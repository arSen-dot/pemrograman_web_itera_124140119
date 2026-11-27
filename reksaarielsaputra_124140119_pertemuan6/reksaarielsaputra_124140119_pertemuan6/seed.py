"""Jalan pintas seeding: python seed.py [file .ini].

Default memakai development.ini (PostgreSQL).
Untuk pengujian lokal tanpa PostgreSQL: python seed.py test.ini
"""

import sys

from scripts.initialize_db import main

if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.argv.append('development.ini')
    main(sys.argv)
