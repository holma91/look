"""Add a column

Revision ID: 3e3d6ff9586e
Revises: e699918baecb
Create Date: 2023-04-27 14:21:04.454659

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3e3d6ff9586e'
down_revision = 'e699918baecb'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('account', sa.Column('last_transaction_date', sa.DateTime))

def downgrade():
    op.drop_column('account', 'last_transaction_date')
