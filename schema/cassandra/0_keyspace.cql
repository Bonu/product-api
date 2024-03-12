CREATE KEYSPACE IF NOT EXISTS product_keyspace
    WITH REPLICATION = {
        'class' : 'SimpleStrategy',
        'replication_factor' : 1
        };
