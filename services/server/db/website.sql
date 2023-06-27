CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT NOT NULL PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS "website" (
    "domain" TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "user_website" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "domain" TEXT NOT NULL REFERENCES "website" ("domain") ON DELETE CASCADE,
    "favorited" BOOL NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, domain)
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
    "liked" BOOL NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, product_url)
);

insert into "user" (id) values ('user_2RYsQv4W7NG9YYHaOId6Tq599SV');

-- all preconfigured websites
INSERT INTO Website (domain)
VALUES
    ('zara.com'),
    ('zalando.se'),
    ('boozt.com'),
    ('hm.com'),
    ('asos.com'),
    ('softgoat.com'),
    ('adaysmarch.com'),
    ('sellpy.se'),
    ('na-kd.com'),
    ('careofcarl.se');

INSERT INTO user_website (user_id, domain, favorited)
VALUES
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'zara.com', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'zalando.se', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'boozt.com', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'hm.com', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'asos.com', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'softgoat.com', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'adaysmarch.com', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'sellpy.se', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'na-kd.com', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'careofcarl.se', FALSE);


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

UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey';