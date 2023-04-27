"""create account table

Revision ID: e699918baecb
Revises: 
Create Date: 2023-04-27 14:10:48.499009

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e699918baecb'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE account (
            id INTEGER PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(200)
        )
    """)

def downgrade():
    op.execute("DROP TABLE account")
