const uuid = require('uuid');

const cassandra= require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'product_keyspace'
});

const Product = {
    async create(name, price, description) {
        const pid = uuid.v4();
        const query = `INSERT INTO products (pid, name, price, description) VALUES (?, ?, ?, ?)`;
        await client.execute(query, [pid, name, price, description]);
        return { id, name, price, description };
    },

    async get(pid) {
        const query = `SELECT * FROM products WHERE pid = ?`;
        const result = await client.execute(query, [pid]);
        return result.rows.length > 0 ? result.rows[0] : null;
    },

    async delete(pid) {
        const query = `DELETE FROM products WHERE pid = ?`;
        await client.execute(query, [pid]);
    },

    async update(pid, updates) {
        const updateString = Object.keys(updates).map((key, index) => `${key} = ?`).join(', ');
        const query = `UPDATE products SET ${updateString} WHERE pid = ?`;
        const updateValues = [...Object.values(updates), pid];
        await client.execute(query, updateValues);
    },
};

module.exports = Product;
