"""create initial tables

Revision ID: dab6408bea5a
Revises: 
Create Date: 2023-04-28 14:06:07.570124

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dab6408bea5a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TYPE "audience_type" AS ENUM (
        'men',
        'women',
        'unisex'
        );

        CREATE TABLE "abstract_item" (
        "id" text PRIMARY KEY,
        "brand" text,
        "gender" audience_type
        );

        CREATE TABLE "item" (
        "id" text PRIMARY KEY,
        "abstract_item_id" text,
        "website" text,
        "country" char(2),
        "item_url" text,
        "currency" char(3),
        "price" numeric(12, 2),
        "name" text,
        "description" text,
        "updated_at" timestamp,
        "removed" boolean
        );

        CREATE TABLE "item_color" (
        "item_id" text,
        "color_id" text
        );

        CREATE TABLE "item_category" (
        "item_id" text,
        "category_id" int,
        "rank" int
        );

        CREATE TABLE "item_image" (
        "item_id" text,
        "image_id" text
        );

        CREATE TABLE "item_size" (
        "item_id" text,
        "size_id" text,
        "in_stock" boolean
        );

        CREATE TABLE "color" (
        "name" text PRIMARY KEY
        );

        CREATE TABLE "category" (
        "id" SERIAL PRIMARY KEY,
        "name" text,
        "audience" audience_type
        );

        CREATE TABLE "image" (
        "url" text PRIMARY KEY
        );

        CREATE TABLE "size" (
        "size" text PRIMARY KEY
        );

        CREATE TABLE "brand" (
        "id" text PRIMARY KEY
        );

        CREATE TABLE "website" (
        "domain" text PRIMARY KEY,
        "multi_brand" boolean,
        "second_hand" boolean
        );

        CREATE UNIQUE INDEX ON "item_color" ("item_id", "color_id");

        CREATE UNIQUE INDEX ON "item_category" ("item_id", "category_id");

        CREATE UNIQUE INDEX ON "item_image" ("item_id", "image_id");

        CREATE UNIQUE INDEX ON "item_size" ("item_id", "size_id");

        CREATE UNIQUE INDEX ON "category" ("name", "audience");

        ALTER TABLE "abstract_item" ADD FOREIGN KEY ("brand") REFERENCES "brand" ("id");

        ALTER TABLE "item" ADD FOREIGN KEY ("abstract_item_id") REFERENCES "abstract_item" ("id");

        ALTER TABLE "item" ADD FOREIGN KEY ("website") REFERENCES "website" ("domain");

        ALTER TABLE "item_color" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id");

        ALTER TABLE "item_color" ADD FOREIGN KEY ("color_id") REFERENCES "color" ("name");

        ALTER TABLE "item_category" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id");

        ALTER TABLE "item_category" ADD FOREIGN KEY ("category_id") REFERENCES "category" ("id");

        ALTER TABLE "item_image" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id");

        ALTER TABLE "item_image" ADD FOREIGN KEY ("image_id") REFERENCES "image" ("url");

        ALTER TABLE "item_size" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id");

        ALTER TABLE "item_size" ADD FOREIGN KEY ("size_id") REFERENCES "size" ("size");
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE "item_color";
        DROP TABLE "item_category";
        DROP TABLE "item_image";
        DROP TABLE "item_size";
        DROP TABLE "color";
        DROP TABLE "category";
        DROP TABLE "image";
        DROP TABLE "size";
        DROP TABLE "item";
        DROP TABLE "abstract_item";
        DROP TABLE "brand";
        DROP TABLE "website";
        DROP TYPE "audience_type";
        """
    )
