CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT NOT NULL PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS "website" (
    "domain" TEXT NOT NULL PRIMARY KEY,
    "multi_brand" BOOL NOT NULL,
    "second_hand" BOOL NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_website" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "website_id" TEXT NOT NULL REFERENCES "website" ("domain") ON DELETE CASCADE,
    UNIQUE(user_id, website_id)
);

CREATE TABLE IF NOT EXISTS "product" (
    "url" TEXT NOT NULL PRIMARY KEY,
    domain TEXT NOT NULL REFERENCES "website" ("domain") ON DELETE CASCADE,
    brand TEXT,
    name TEXT,
    price NUMERIC(12, 2),
    currency CHAR(3),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "product_image" (
    product_url TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_product" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "product_url" TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    UNIQUE(user_id, product_url)
);

insert into "user" (id) values ('user_2RYsQv4W7NG9YYHaOId6Tq599SV');

INSERT INTO Website (domain, multi_brand, second_hand)
VALUES
    ('zara.com', false, false),
    ('zalando.com', true, false),
    ('boozt.com', true, false),
    ('hm.com', false, false),
    ('asos.com', true, false),
    ('softgoat.com', false, false),
    ('adaysmarch.com', false, false),
    ('sellpy.com', true, true),
    ('nakd.com', false, false),
    ('careofcarl.com', true, false);

INSERT INTO user_website (user_id, website_id)
VALUES
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'zara.com'),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'boozt.com');


INSERT INTO product (url, domain, brand, name, price, currency)
VALUES 
('https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey', 'softgoat.com', 'Soft Goat', 'MEN''S FINE KNIT T-SHIRT', 1695.00, 'SEK'),
('https://softgoat.com/p/mens-fine-knit-t-shirt-white', 'softgoat.com', 'Soft Goat', 'MEN''S FINE KNIT T-SHIRT', 1695.00, 'SEK');

INSERT INTO product_image (product_url, image_url)
VALUES
('https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey', 'https://softgoat.centracdn.net/client/dynamic/images/2196_d9c41cfa31-softgoat-ss23-ss1703-mens-t-shirt-navy-1695-2-size1024.jpg'),
('https://softgoat.com/p/mens-fine-knit-t-shirt-white', 'https://softgoat.centracdn.net/client/dynamic/images/2196_58f2100716-softgoat-ss23-ss1701-mens-t-shirt-white-1695-2-size1600.jpg');

INSERT INTO user_product (user_id, product_url)
VALUES
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-fine-knit-t-shirt-white');