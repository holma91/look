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
    image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_product" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "product_url" TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    "liked" BOOL NOT NULL DEFAULT FALSE,
    "purchased" BOOL NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, product_url)
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
('https://softgoat.com/p/mens-collar-navy', 'softgoat.com', 'Soft Goat Men', 'Men''s Collar', 2027.00, 'SEK');

INSERT INTO product_image (product_url, image_url)
VALUES
('https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey', 'https://softgoat.centracdn.net/client/dynamic/images/2196_d9c41cfa31-softgoat-ss23-ss1703-mens-t-shirt-navy-1695-2-size1024.jpg'),
('https://softgoat.com/p/mens-fine-knit-t-shirt-white', 'https://softgoat.centracdn.net/client/dynamic/images/2196_58f2100716-softgoat-ss23-ss1701-mens-t-shirt-white-1695-2-size1600.jpg'),
('https://softgoat.com/p/mens-waffle-knit-sea-foam', 'https://softgoat.centracdn.net/client/dynamic/images/2177_49b9783922-3-size1024.jpg'),
('https://softgoat.com/p/mens-collar-navy', 'https://softgoat.centracdn.net/client/dynamic/images/2202_8ee99fa254-softgoat-ss23-25030-mens-collar-navy-2895-2-size1024.jpg');

INSERT INTO user_product (user_id, product_url)
VALUES
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-fine-knit-t-shirt-white'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-waffle-knit-sea-foam'),
('user_2RYsQv4W7NG9YYHaOId6Tq599SV', 'https://softgoat.com/p/mens-collar-navy');

UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-fine-knit-t-shirt-light-grey';

UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-collar-navy';

UPDATE user_product SET liked = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-waffle-knit-sea-foam';

UPDATE user_product SET purchased = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-collar-navy';

UPDATE user_product SET purchased = TRUE
WHERE user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV' AND product_url = 'https://softgoat.com/p/mens-waffle-knit-sea-foam';