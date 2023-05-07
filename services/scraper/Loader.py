import json
import logging

from sqlalchemy import create_engine, text
from pydantic import ValidationError

from Types import Item

class Loader:
    "reads the lightly parsed data from s3, transforms it and puts it into postgres"
    def __init__(self, db_url: str):
        self.engine = create_engine(db_url)

    def run(self, s3_path: str):
        items = self.read_from_s3(s3_path)
        self.load(items)

    def read_from_s3(self, s3_path: str) -> list[Item]:
        items = []
        with open(s3_path, 'r') as file:
            for line_number, line in enumerate(file):
                try:
                    item = Item(**json.loads(line))
                    items.append(item)
                except ValidationError as e:
                    logging.error(f"validation error at line {line_number} for s3_path: {s3_path}: {e}")

        return items

    def load(self, items: list[Item]):
        for item in items:
            abstract_item_id = f"{item.brand}:{item.item_id}".strip().lower()
            item_id = f"{item.domain}:{item.brand}:{item.item_id}".strip().lower()

            with self.engine.begin() as conn:
                # Insert categories if they don't exist
                for category in item.categories:
                    conn.execute(
                        text(
                            """
                            INSERT INTO category (name, audience)
                            VALUES (:name, :audience)
                            ON CONFLICT (name, audience) DO NOTHING
                            """
                        ),
                        {"name": category.name.strip().lower(), "audience": item.audience},
                    )

                # Insert sizes if they don't exist
                for size in item.sizes:
                    conn.execute(
                        text(
                            """
                            INSERT INTO size (size)
                            VALUES (:size)
                            ON CONFLICT (size) DO NOTHING
                            """
                        ),
                        {"size": size.size.strip().lower()},
                    )
                
                # Insert images if they don't exist
                for image in item.images:
                    conn.execute(
                        text(
                            """
                            INSERT INTO image (url)
                            VALUES (:url)
                            ON CONFLICT (url) DO NOTHING
                            """
                        ),
                        {"url": image.strip().lower()},
                    )
                
                # Insert colors if they don't exist
                for color in item.colors:
                    conn.execute(
                        text(
                            """
                            INSERT INTO color (name)
                            VALUES (:name)
                            ON CONFLICT (name) DO NOTHING
                            """
                        ),
                        {"name": color.name.strip().lower()},
                    )

                # Insert abstract_item
                conn.execute(
                    text(
                        """
                        INSERT INTO abstract_item (id, brand, gender)
                        VALUES (:id, :brand, :gender)
                        ON CONFLICT (id) DO NOTHING
                        """
                    ),
                    {"id": abstract_item_id, "brand": item.brand.strip().lower(), "gender": item.audience},
                )

                currency = item.currency.strip().lower() if item.currency else None
                price = item.price if item.price else None

                # Insert item
                conn.execute(
                    text(
                        """
                        INSERT INTO item (id, abstract_item_id, website, country, item_url, currency, price, name, description, updated_at, removed)
                        VALUES (:id, :abstract_item_id, :website, :country, :item_url, :currency, :price, :name, :description, NOW(), false)
                        ON CONFLICT (id) DO UPDATE SET
                            updated_at = NOW(),
                            removed = false
                        """
                    ),
                    {
                        "id": item_id,
                        "abstract_item_id": abstract_item_id,
                        "website": item.domain.strip().lower(),
                        "country": item.country.strip().lower(),
                        "item_url": item.item_url.strip().lower(),
                        "currency": currency,
                        "price": price,
                        "name": item.name,
                        "description": item.description,
                    },
                )

                for color in item.colors:
                    conn.execute(
                        text(
                            """
                            INSERT INTO item_color (item_id, color_id)
                            VALUES (:item_id, (:color_id))
                            ON CONFLICT (item_id, color_id) DO NOTHING
                            """
                        ),
                        {"item_id": item_id, "color_id": color.name.strip().lower()},
                    )

                for category in item.categories:
                    conn.execute(
                        text(
                            """
                            INSERT INTO item_category (item_id, category_id, rank)
                            VALUES (:item_id, (SELECT id FROM category WHERE name = :name AND audience = :audience), :rank)
                            ON CONFLICT (item_id, category_id) DO NOTHING
                            """
                        ),
                        {"item_id": item_id, "name": category.name.strip().lower(), "audience": item.audience ,"rank": category.rank},
                    )

                for image in item.images:
                    conn.execute(
                        text(
                            """
                            INSERT INTO item_image (item_id, image_id)
                            VALUES (:item_id, :url)
                            ON CONFLICT (item_id, image_id) DO NOTHING
                            """
                        ),
                        {"item_id": item_id, "url": image.strip().lower()},
                    )

                for size in item.sizes:
                    conn.execute(
                        text(
                            """
                            INSERT INTO item_size (item_id, size_id, in_stock)
                            VALUES (:item_id, :size, :in_stock)
                            ON CONFLICT (item_id, size_id) DO UPDATE SET
                                in_stock = :in_stock
                            """
                        ),
                        {"item_id": item_id, "size": size.size.strip().lower(), "in_stock": size.in_stock},
                    )
    