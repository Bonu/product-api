const uuid = require('uuid');
const Product = require("../models/product.model");
const { Router } = require('express');
const app = Router();


const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const randomUUID = uuid.v4();
        const newProduct = await Product.create(randomUUID, name, price, description);
        res.json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Error creating product');
    }
};

const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.get(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        console.error('Error getting product:', err);
        res.status(500).send('Error getting product');
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.delete(productId);
        res.sendStatus(204); // No content
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product');
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;
        await Product.update(productId, updates);
        res.sendStatus(200); // OK
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
    }
};

module.exports = {createProduct, getProduct, updateProduct, deleteProduct};