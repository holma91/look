from sqlalchemy import create_engine, text
from Types import Primitive_Item, Item

db_urls = {
    "dev": "postgresql://lapuerta@localhost:5432/hasse",
    "prod": "",
}

class Database:
    
    def __init__(self, env: str):
        self.environment = env
        self.engine = create_engine(db_urls[env])

    def insert_item(self, item: Item):
        with self.engine.begin() as conn:
            # Insert categories if they don't exist
            for category in item.categories:
                conn.execute(
                    text(
                        """
                        INSERT INTO category (name, audience)
                        VALUES (:name, :audience)
                        ON CONFLICT (name) DO NOTHING
                        """
                    ),
                    {"name": category["name"], "audience": item.audience},
                )
            
            # Insert sizes if they don't exist
            for size in item.sizes.keys():
                conn.execute(
                    text(
                        """
                        INSERT INTO size (size)
                        VALUES (:size)
                        ON CONFLICT (size) DO NOTHING
                        """
                    ),
                    {"size": size},
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
                    {"url": image},
                )

            # Insert colors if they don't exist
            for color in item.colors:
                conn.execute(
                    text(
                        """
                        INSERT INTO color (color)
                        VALUES (:color)
                        ON CONFLICT (color) DO NOTHING
                        """
                    ),
                    {"color": color},
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
                {"id": f"{item.brand}:{item.item_id}".lower(), "brand": item.brand, "gender": item.audience},
            )

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
                    "id": f"{item.domain}:{item.brand}:{item.item_id}".lower(),
                    "abstract_item_id": f"{item.brand}:{item.item_id}".lower(),
                    "website": item.domain,
                    "country": item.country,
                    "item_url": item.item_url,
                    "currency": item.currency,
                    "price": item.price,
                    "name": item.name,
                    "description": item.description,
                },
            )


            for color in item.colors:
                conn.execute(
                    text(
                        """
                        INSERT INTO item_color (item_id, color_id)
                        VALUES (:item_id, (SELECT id FROM color WHERE color = :color))
                        ON CONFLICT (item_id, color_id) DO NOTHING
                        """
                    ),
                    {"item_id": f"{item.domain}:{item.brand}:{item.item_id}".lower(), "color": color},
                )

            for category in item.categories:
                conn.execute(
                    text(
                        """
                        INSERT INTO item_category (item_id, category_id, rank)
                        VALUES (:item_id, (SELECT id FROM category WHERE name = :name), :rank)
                        ON CONFLICT (item_id, category_id) DO NOTHING
                        """
                    ),
                    {"item_id": f"{item.domain}:{item.brand}:{item.item_id}".lower(), "name": category["name"], "rank": category["rank"]},
                )

            for image in item.images:
                conn.execute(
                    text(
                        """
                        INSERT INTO item_image (item_id, image_id)
                        VALUES (:item_id, (SELECT id FROM image WHERE url = :url))
                        ON CONFLICT (item_id, image_id) DO NOTHING
                        """
                    ),
                    {"item_id": f"{item.domain}:{item.brand}:{item.item_id}".lower(), "url": image},
                )

            for size, in_stock in item.sizes.items():
                conn.execute(
                    text(
                        """
                        INSERT INTO item_size (item_id, size_id, in_stock)
                        VALUES (:item_id, (SELECT id FROM size WHERE size = :size), :in_stock)
                        ON CONFLICT (item_id, size_id) DO UPDATE SET
                            in_stock = :in_stock
                        """
                    ),
                    {"item_id": f"{item.domain}:{item.brand}:{item.item_id}".lower(), "size": size, "in_stock": in_stock},
                )


        print("insert_item:", item)
        