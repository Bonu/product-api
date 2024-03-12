const cassandra= require('cassandra-driver');

let authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], // Replace with your Cassandra host(s)
    authProvider: authProvider,
    keyspace: 'product_keyspace', // Replace with your keyspace name
});

module.exports = client;
