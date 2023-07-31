CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "company" (
    "id" TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "website" (
    "company_id" TEXT NOT NULL REFERENCES "company" ("id") ON DELETE CASCADE,
    "domain" TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "user_company" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "company_id" TEXT NOT NULL REFERENCES "company" ("id") ON DELETE CASCADE,
    "favorited" BOOL NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, company_id)
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
    image_url TEXT NOT NULL,
    UNIQUE(product_url, image_url)
);

CREATE TABLE IF NOT EXISTS "user_product" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "product_url" TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    -- "liked" BOOL NOT NULL DEFAULT FALSE,
    -- "purchased" BOOL NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, product_url)
);

CREATE TABLE IF NOT EXISTS "p_list" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    UNIQUE(id, user_id)
);

insert into "user" (id) values ('user_2RYsQv4W7NG9YYHaOId6Tq599SV');

INSERT INTO company (id)
VALUES
    ('zara'),
    ('zalando'),
    ('boozt'),
    ('hm'),
    ('asos'),
    ('softgoat'),
    ('adaysmarch'),
    ('sellpy'),
    ('na-kd'),
    ('careofcarl'),
    ('loropiana'),
    ('lululemon'),
    ('gucci' ),
    ('moncler' ),
    ('ysl' ),
    ('louisvuitton' ),
    ('farfetch' ),
    ('hermes' ),
    ('prada' ),
    ('valentino' ),
    ('mytheresa' );

INSERT INTO website (company_id, domain)
VALUES
    ('zara', 'zara.com'),
    ('zalando', 'zalando.se'),
    ('zalando', 'zalando.com'),
    ('boozt', 'boozt.com'),
    ('hm', 'hm.com'),
    ('asos', 'asos.com'),
    ('softgoat', 'softgoat.com'),
    ('adaysmarch', 'adaysmarch.com'),
    ('sellpy', 'sellpy.se'),
    ('sellpy', 'sellpy.com'),
    ('na-kd', 'na-kd.com'),
    ('careofcarl', 'careofcarl.se'),
    ('careofcarl', 'careofcarl.com'),
    ('loropiana', 'se.loropiana.com'),
    ('loropiana', 'us.loropiana.com'),
    ('lululemon', 'shop.lululemon.com'),
    ('lululemon', 'eu.lululemon.com'),
    ('gucci', 'gucci.com'),
    ('moncler', 'moncler.com'),
    ('ysl', 'ysl.com'),
    ('louisvuitton', 'louisvuitton.com'),
    ('farfetch', 'farfetch.com'),
    ('hermes', 'hermes.com'),
    ('prada', 'prada.com'),
    ('valentino', 'valentino.com'),
    ('mytheresa', 'mytheresa.com');

INSERT INTO user_company (user_id, company_id, favorited)
VALUES
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'zara', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'zalando', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'boozt', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'hm', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'asos', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'softgoat', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'adaysmarch', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'sellpy', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'na-kd', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'careofcarl', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'loropiana', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'lululemon', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'moncler', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'gucci', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'ysl', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'louisvuitton', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV','farfetch', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV','hermes', TRUE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV','prada', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV','valentino', FALSE),
    ('user_2RYsQv4W7NG9YYHaOId6Tq599SV','mytheresa', FALSE);


INSERT INTO product (url, domain, brand, name, price, currency)
VALUES 
('https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey', 'softgoat.com', 'Soft Goat Men', 'Men''s Fine Knit T-shirt', 1695.00, 'SEK'),
('https://softgoat.com/p/mens-fine-knit-t-shirt-white', 'softgoat.com', 'Soft Goat Men', 'Men''s Fine Knit T-shirt', 1695.00, 'SEK'),
('https://softgoat.com/p/mens-waffle-knit-sea-foam', 'softgoat.com', 'Soft Goat Men', 'Men''s Waffle Knit', 2027.00, 'SEK'),
('https://softgoat.com/p/mens-collar-navy', 'softgoat.com', 'Soft Goat Men', 'Men''s Collar', 2027.00, 'SEK'),
('https://softgoat.com/p/boatneck-red', 'softgoat.com', 'Soft Goat Women', 'Boatneck', 2797.00, 'SEK'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html','zalando.se','Prada','UNISEX - Solglasögon - black', 3555,'SEK');

INSERT INTO product_image (product_url, image_url)
VALUES
('https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey', 'https://softgoat.centracdn.net/client/dynamic/images/2196_d9c41cfa31-softgoat-ss23-ss1703-mens-t-shirt-navy-1695-2-size1024.jpg'),
('https://softgoat.com/p/mens-fine-knit-t-shirt-white', 'https://softgoat.centracdn.net/client/dynamic/images/2196_58f2100716-softgoat-ss23-ss1701-mens-t-shirt-white-1695-2-size1600.jpg'),
('https://softgoat.com/p/mens-waffle-knit-sea-foam', 'https://softgoat.centracdn.net/client/dynamic/images/2177_49b9783922-3-size1024.jpg'),
('https://softgoat.com/p/mens-collar-navy', 'https://softgoat.centracdn.net/client/dynamic/images/2202_8ee99fa254-softgoat-ss23-25030-mens-collar-navy-2895-2-size1024.jpg'),
('https://softgoat.com/p/boatneck-red', 'https://softgoat.centracdn.net/client/dynamic/images/2216_7d95b8536f-2-size1024.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/f8baacffcfee40d69c1bf0667023c112/c56d781b37bf42dbbf0b5d07070598de.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/74dc1f4906e2432d9d2d9e461d91636a/f78b98bfcdf74f0fa90cf40ccabcc798.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/52d0541ee0c94af89270f9f1834db20f/85819b7eb0b24f049b3a1500150f5271.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/2a9c4849763449949589cb64fb311188/8307b6719c574788894380e1a8a34a07.jpg');

INSERT INTO user_product (user_id, product_url)
VALUES
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-fine-knit-t-shirt-white'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-waffle-knit-sea-foam'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-collar-navy'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/boatneck-red'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html');

UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey';
UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-collar-navy';
UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-waffle-knit-sea-foam';
UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html';

UPDATE user_product SET purchased = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-collar-navy';

UPDATE user_product SET purchased = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-waffle-knit-sea-foam';