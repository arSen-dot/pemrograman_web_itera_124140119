"""create matakuliah table

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2026-11-26
"""

from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Buat tabel matakuliah."""
    op.create_table(
        'matakuliah',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('kode_mk', sa.Text(), nullable=False),
        sa.Column('nama_mk', sa.Text(), nullable=False),
        sa.Column('sks', sa.Integer(), nullable=False),
        sa.Column('semester', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('kode_mk'),
    )


def downgrade():
    """Hapus tabel matakuliah."""
    op.drop_table('matakuliah')
