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


SELECT w.*, 
    CASE WHEN uw.user_id = 'user_2RY72mVL8mp3txPLuO3HVoMjGyF' THEN TRUE ELSE FALSE END AS isFavorite 
FROM website w 
LEFT JOIN user_website uw 
ON uw.website_id = w.domain 
AND uw.user_id = 'user_2RY72mVL8mp3txPLuO3HVoMjGyF';
