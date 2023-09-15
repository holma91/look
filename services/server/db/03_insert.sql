-- FOR THE DEV DATABASE

\c web_dev

insert into "user" (id) values ('CoRDzg4muzOJ5IVfGOtwSjIR8Mo1');

INSERT INTO company (id)
VALUES
    ('zara'),
    ('zalando'),
    ('boozt'),
    ('hm'),
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
    ('softgoat', 'softgoat.com'),
    ('adaysmarch', 'adaysmarch.com'),
    ('sellpy', 'sellpy.se'),
    ('sellpy', 'sellpy.com'),
    ('na-kd', 'na-kd.com'),
    ('careofcarl', 'careofcarl.se'),
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


INSERT INTO product (url, schema_url, domain, brand, name, price, currency)
VALUES 
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', '/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'zalando.se', 'Holzweiler', 'OCEANIC ZIP HOODIE - Tröja med dragkedja', 3725.00, 'SEK'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', '/prada-solglasoegon-black-p2451k03d-q11.html', 'zalando.se','Prada','UNISEX - Solglasögon - black', 3555,'SEK');

INSERT INTO product_image (product_url, image_url)
VALUES
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/e821827b5b3e4af3900008c9050696a8/a7ee6fbed5764b85839ed9c05ec2eeaa.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/3c6c70ef26804275b82b0b0814a08317/84a7df03e65e419297acc827847fe28a.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/0e36a35018d64ace8104794b4b93e909/e75ddafe5ce647a0aff95dbdc1b605dc.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/ef6d4f19d80442e0add96dc2bf82672a/c40f4e82ba6546f69b76a9e3dc7641a1.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/e03c271f870649a58f7e6f96b94e9a9b/0202ecddfb4d4af29c47eb2fd20f7498.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/f8baacffcfee40d69c1bf0667023c112/c56d781b37bf42dbbf0b5d07070598de.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/74dc1f4906e2432d9d2d9e461d91636a/f78b98bfcdf74f0fa90cf40ccabcc798.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/52d0541ee0c94af89270f9f1834db20f/85819b7eb0b24f049b3a1500150f5271.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/2a9c4849763449949589cb64fb311188/8307b6719c574788894380e1a8a34a07.jpg');

INSERT INTO user_product (user_id, product_url)
VALUES
('CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html'),
('CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html');

INSERT INTO p_list (id, user_id)
VALUES
('purchases', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1');

INSERT INTO c_list (id, user_id)
VALUES
('favorites', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1'),
('working', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1'),
('testlist', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1');


INSERT INTO list_product (list_id, user_id, product_url)
VALUES
('purchases', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html');

INSERT INTO list_company (list_id, user_id, company_id)
VALUES
('favorites', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'zalando'),
('working', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'farfetch'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'zalando'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'gucci'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'hermes'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'adaysmarch');

UPDATE user_product SET liked = TRUE
WHERE user_id = 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1' AND product_url = 'https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html';
UPDATE user_product SET liked = TRUE
WHERE user_id = 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1' AND product_url = 'https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html/';

-- FOR THE TEST DATABASE
\c web_test
insert into "user" (id) values ('CoRDzg4muzOJ5IVfGOtwSjIR8Mo1');

INSERT INTO company (id)
VALUES
    ('zara'),
    ('zalando'),
    ('boozt'),
    ('hm'),
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
    ('softgoat', 'softgoat.com'),
    ('adaysmarch', 'adaysmarch.com'),
    ('sellpy', 'sellpy.se'),
    ('sellpy', 'sellpy.com'),
    ('na-kd', 'na-kd.com'),
    ('careofcarl', 'careofcarl.se'),
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


INSERT INTO product (url, schema_url, domain, brand, name, price, currency)
VALUES 
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', '/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'zalando.se', 'Holzweiler', 'OCEANIC ZIP HOODIE - Tröja med dragkedja', 3725.00, 'SEK'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', '/prada-solglasoegon-black-p2451k03d-q11.html', 'zalando.se','Prada','UNISEX - Solglasögon - black', 3555,'SEK');

INSERT INTO product_image (product_url, image_url)
VALUES
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/e821827b5b3e4af3900008c9050696a8/a7ee6fbed5764b85839ed9c05ec2eeaa.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/3c6c70ef26804275b82b0b0814a08317/84a7df03e65e419297acc827847fe28a.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/0e36a35018d64ace8104794b4b93e909/e75ddafe5ce647a0aff95dbdc1b605dc.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/ef6d4f19d80442e0add96dc2bf82672a/c40f4e82ba6546f69b76a9e3dc7641a1.jpg'),
('https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html', 'https://img01.ztat.net/article/spp-media-p1/e03c271f870649a58f7e6f96b94e9a9b/0202ecddfb4d4af29c47eb2fd20f7498.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/f8baacffcfee40d69c1bf0667023c112/c56d781b37bf42dbbf0b5d07070598de.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/74dc1f4906e2432d9d2d9e461d91636a/f78b98bfcdf74f0fa90cf40ccabcc798.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/52d0541ee0c94af89270f9f1834db20f/85819b7eb0b24f049b3a1500150f5271.jpg'),
('https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html', 'https://img01.ztat.net/article/spp-media-p1/2a9c4849763449949589cb64fb311188/8307b6719c574788894380e1a8a34a07.jpg');

INSERT INTO user_product (user_id, product_url)
VALUES
('CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html'),
('CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html');

INSERT INTO p_list (id, user_id)
VALUES
('purchases', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1');

INSERT INTO c_list (id, user_id)
VALUES
('favorites', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1'),
('working', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1'),
('testlist', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1');


INSERT INTO list_product (list_id, user_id, product_url)
VALUES
('purchases', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html');

INSERT INTO list_company (list_id, user_id, company_id)
VALUES
('favorites', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'zalando'),
('working', 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'farfetch'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'zalando'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'gucci'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'hermes'),
('working','CoRDzg4muzOJ5IVfGOtwSjIR8Mo1', 'adaysmarch');

UPDATE user_product SET liked = TRUE
WHERE user_id = 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1' AND product_url = 'https://www.zalando.se/holzweiler-oceanic-zip-hoodie-luvtroeja-dk-grey-ho021000u-c11.html';
UPDATE user_product SET liked = TRUE
WHERE user_id = 'CoRDzg4muzOJ5IVfGOtwSjIR8Mo1' AND product_url = 'https://www.zalando.se/prada-solglasoegon-black-p2451k03d-q11.html/';