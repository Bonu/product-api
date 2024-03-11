const express = require('express');
const Product = require('./models/product.model');
const uuid = require("uuid");

const app = express();

app.use(express.json())

app.post('/products', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const randomUUID = uuid.v4();
        const newProduct = await Product.create(randomUUID, name, price, description);
        res.json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Error creating product');
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await Product.get(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        console.error('Error getting product:', err);
        res.status(500).send('Error getting product');
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.delete(productId);
        res.sendStatus(204); // No content
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product');
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;
        await Product.update(productId, updates);
        res.sendStatus(200); // OK
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
})
