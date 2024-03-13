// -------------- cyclist_name ---
DROP TABLE IF EXISTS product_keyspace.products;
DROP TABLE IF EXISTS product_keyspace.product_visits;
DROP TABLE IF EXISTS product_keyspace.deleted_products;

CREATE TABLE IF NOT EXISTS product_keyspace.products (
      pid uuid PRIMARY KEY,
      name text ,
      price decimal ,
      description text,
      created_date timestamp,
);

CREATE TABLE IF NOT EXISTS product_keyspace.product_visits (
    pid uuid PRIMARY KEY,
    visits counter,
);

CREATE TABLE IF NOT EXISTS product_keyspace.deleted_products (
    pid uuid PRIMARY KEY,
    name text,
    price decimal,
    description text,
    deleted_date timestamp,
);

// Remove the record from the table
TRUNCATE product_keyspace.products;
TRUNCATE product_keyspace.product_visits;
TRUNCATE product_keyspace.deleted_products;

INSERT INTO product_keyspace.products(pid, name, price, description) values (now(), 'SonyWalkman', 299, 'Sony Walkman from year 2000');
INSERT INTO product_keyspace.products(pid, name, price, description) values (now(), 'SD MP3 player', 199, 'SD MP3 Player 2000');
INSERT INTO product_keyspace.products(pid, name, price, description) values (now(), 'MP3 player', 99, 'MP3 Player 2024');

INSERT INTO product_keyspace.deleted_products(pid, name, price, description) values (now(), 'MP3 player v1', 199, 'MP3 Player 2022');
