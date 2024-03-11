const cassandra= require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['172.20.0.2'], // Replace with your Cassandra host(s)
    keyspace: 'product_keyspace', // Replace with your keyspace name
});

module.exports = client;
