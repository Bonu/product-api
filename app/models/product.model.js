const cassandra= require('cassandra-driver');
const {logger} = require('../middleware/log')
let authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra'); // Get secrets from vault
const client = new cassandra.Client({
    contactPoints: ['bitnami-cassandra-v1', '127.0.0.1'],
    authProvider: authProvider,
    localDataCenter: 'datacenter1',
    keyspace: 'product_keyspace'
});

const Product = {
    async create(uuid ,name, price, description) {
        const query = `INSERT INTO product_keyspace.products (pid, name, price, description, created_date) VALUES (?, ?, ?, ?, ?)`;
        const queryUpdateView = `UPDATE product_keyspace.product_visits SET visits = visits+0 WHERE pid = ?`;
        await client.execute(query, [uuid, name, price, description, null], {hints: [null, null, "bigint", null, null]});
        await client.execute(queryUpdateView, [uuid]); // convert into a serverless function
        return { uuid, name, price, description };
    },

    async get(pid) {
        const query = `SELECT * FROM product_keyspace.products WHERE pid = ?`;
        const queryUpdateView = `UPDATE product_keyspace.product_visits SET visits = visits+1 WHERE pid = ?`;
        const result = await client.execute(query, [pid]);
        if(result.rows.length > 0) {
            await client.execute(queryUpdateView, [pid]); // convert into a serverless function
            return result.rows[0];
        } else {
            logger.warn("No record found in table for pid: ", pid);
            return null;
        }
    },

    async delete(pid) {
        try {
            // Get product details from active table
            const getProductQuery = `SELECT * product_keyspace.products WHERE pid = ?`;
            const productResult = await client.execute(getProductQuery, [pid]);

            if (!productResult.rows.length) {
                return { message: 'Product not found' };
            }

            const product = productResult.rows[0];

            // Insert product into deleted table with deletion timestamp
            const insertDeletedQuery = `INSERT INTO product_keyspace.deleted_products(pid, name, price, description, deleted_date)
                                 VALUES (?, ?, ?, ?, ?)`;
            const deletedResult = await client.execute(insertDeletedQuery, [
                product.pid, product.name, product.price, product.description, new Date()
            ]);

            // Delete product from active table
            const deleteActiveQuery = `DELETE FROM product_keyspace.products WHERE pid = ?`;
            await client.execute(deleteActiveQuery, [pid]);

            return { message: 'Product deleted successfully' };
        } catch (err) {
            logger.error('Error deleting product:', err);
            throw err; // Re-throw for handling in API route
        }
    },

    async update(pid, updates) {
        const updateString = Object.keys(updates).map((key, index) => `${key} = ?`).join(', ');
        const query = `UPDATE product_keyspace.products SET ${updateString} WHERE pid = ?`;
        const updateValues = [...Object.values(updates), pid];
        await client.execute(query, updateValues);
    },

    async getMostViewed(minViews, limit) {
        // Prepare CQL statements
        const getProductById = 'SELECT * FROM product_keyspace.products WHERE pid = ?';
        const getViewCount = 'SELECT visits FROM product_keyspace.product_visits WHERE pid = ?';

        try {
            // Find product IDs with most views (limited)
            const results = await client.execute(
                ` SELECT product_keyspace.product_visits.pid FROM product_keyspace.product_visits WHERE product_visits.visits >= ? ORDER BY visits DESC LIMIT ?`, [minViews, limit]);

            const productIds = results.rows.map(row => row.pid);

            // Fetch product details and view counts concurrently
            const productDetails = await Promise.all(
                productIds.map(id => client.execute(getProductById, [id]))
            );
            const viewCounts = await Promise.all(
                productIds.map(id => client.execute(getViewCount, [id]))
            );

            // Combine product data with view counts
            const topProducts = productDetails.map((data, index) => {
                const product = data.rows[0];
                product.views = viewCounts[index].rows[0].views;
                return product;
            });

        } catch (err) {
            logger.error('Error fetching products:', err);
            return null;
        }
    },
};

module.exports = Product;
