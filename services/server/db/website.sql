INSERT INTO Website (domain, multi_brand, second_hand)
VALUES
    ('zara.com', false, false),
    ('zalando.com', true, false),
    ('boozt.com', true, false),
    ('hm.com', false, false);

INSERT INTO user_website (user_id, website_id)
VALUES
    ('user_2RWmNFQBs9ubw20BNrGzsxuo6Di', 'zara.com'),
    ('user_2RWmNFQBs9ubw20BNrGzsxuo6Di', 'boozt.com');