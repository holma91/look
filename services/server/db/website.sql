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
    ('user_2RY72mVL8mp3txPLuO3HVoMjGyF', 'zara.com'),
    ('user_2RY72mVL8mp3txPLuO3HVoMjGyF', 'boozt.com');

insert into "user" (id) values ('user_2RY72mVL8mp3txPLuO3HVoMjGyF');


SELECT w.*, 
    CASE WHEN uw.user_id = 'user_2RY72mVL8mp3txPLuO3HVoMjGyF' THEN TRUE ELSE FALSE END AS isFavorite 
FROM website w 
LEFT JOIN user_website uw 
ON uw.website_id = w.domain 
AND uw.user_id = 'user_2RY72mVL8mp3txPLuO3HVoMjGyF';

CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT NOT NULL  PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS "website" (
    "domain" TEXT NOT NULL  PRIMARY KEY,
    "multi_brand" BOOL NOT NULL,
    "second_hand" BOOL NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_website" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "website_id" TEXT NOT NULL REFERENCES "website" ("domain") ON DELETE CASCADE
);