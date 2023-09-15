-- FOR THE DEV DATABASE
\c web_dev

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

CREATE TABLE IF NOT EXISTS "product" (
    "url" TEXT NOT NULL PRIMARY KEY,
    "schema_url" TEXT,
    domain TEXT NOT NULL REFERENCES "website" ("domain") ON DELETE CASCADE,
    brand TEXT,
    name TEXT,
    price NUMERIC(12, 2),
    currency CHAR(3)
);

CREATE TABLE IF NOT EXISTS "product_image" (
    product_url TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    -- product_url TEXT NOT NULL REFERENCES "user_product" ("product_url") ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    UNIQUE(product_url, image_url)
);

CREATE TABLE IF NOT EXISTS "user_product" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "product_url" TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    "liked" BOOL NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, product_url)
);

CREATE TABLE IF NOT EXISTS "p_list" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    PRIMARY KEY(id, user_id)
);

CREATE TABLE IF NOT EXISTS "c_list" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    PRIMARY KEY(id, user_id)
);

CREATE TABLE IF NOT EXISTS "list_product" (
    "list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_url" TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    FOREIGN KEY (list_id, user_id) REFERENCES p_list(id, user_id) ON DELETE CASCADE,
    UNIQUE(list_id, user_id, product_url)
);

CREATE TABLE IF NOT EXISTS "list_company" (
    "list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL REFERENCES "company" ("id") ON DELETE CASCADE,
    FOREIGN KEY (list_id, user_id) REFERENCES c_list(id, user_id) ON DELETE CASCADE,
    UNIQUE(list_id, user_id, company_id)
);


-- FOR THE TEST DATABASE

\c web_test

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

CREATE TABLE IF NOT EXISTS "product" (
    "url" TEXT NOT NULL PRIMARY KEY,
    "schema_url" TEXT,
    domain TEXT NOT NULL REFERENCES "website" ("domain") ON DELETE CASCADE,
    brand TEXT,
    name TEXT,
    price NUMERIC(12, 2),
    currency CHAR(3)
);

CREATE TABLE IF NOT EXISTS "product_image" (
    product_url TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    -- product_url TEXT NOT NULL REFERENCES "user_product" ("product_url") ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    UNIQUE(product_url, image_url)
);

CREATE TABLE IF NOT EXISTS "user_product" (
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "product_url" TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    "liked" BOOL NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, product_url)
);

CREATE TABLE IF NOT EXISTS "p_list" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    PRIMARY KEY(id, user_id)
);

CREATE TABLE IF NOT EXISTS "c_list" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    PRIMARY KEY(id, user_id)
);

CREATE TABLE IF NOT EXISTS "list_product" (
    "list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_url" TEXT NOT NULL REFERENCES "product" ("url") ON DELETE CASCADE,
    FOREIGN KEY (list_id, user_id) REFERENCES p_list(id, user_id) ON DELETE CASCADE,
    UNIQUE(list_id, user_id, product_url)
);

CREATE TABLE IF NOT EXISTS "list_company" (
    "list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL REFERENCES "company" ("id") ON DELETE CASCADE,
    FOREIGN KEY (list_id, user_id) REFERENCES c_list(id, user_id) ON DELETE CASCADE,
    UNIQUE(list_id, user_id, company_id)
);