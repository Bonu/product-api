CREATE KEYSPACE IF NOT EXISTS product_keyspace WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

CREATE TABLE IF NOT EXISTS product_keyspace.products  (
	pid uuid PRIMARY KEY,
	name text,
	price decimal,
	description text,
	visits int,
);


INSERT INTO product_keyspace.products(pid, name, price, description, visits) values (now(), 'SonyWalkman', 299, 'Sony Walkman from year 2000',0);
INSERT INTO product_keyspace.products(pid, name, price, description, visits) values (now(), 'SD MP3 player', 199, 'SD MP3 Player 2000',0);
