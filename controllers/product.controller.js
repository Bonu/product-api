const uuid = require('uuid');
const Product = require("../models/product.model");
const { Router } = require('express');
const app = Router();
const {logger} = require('../middleware/log')


const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        if (!name || !price) {
            return res.status(400).json({'message':'Name and price are required'});
        }
        const randomUUID = uuid.v4();
        const newProduct = await Product.create(randomUUID.toString(), name, price, description);
        res.json(newProduct);
    } catch (err) {
        logger.error('Error creating product:', err);
        res.status(500).json({'message':'Error creating product'});
    }
};

const currencyLayerApiKey = 'YOUR_CURRENCY_LAYER_API_KEY'; // Optional

// Function to fetch exchange rates (if needed)
async function getExchangeRate(amount, from, to, callback) {
    const fetch = require('node-fetch');
    const url = `https://currencyconverter.p.rapidapi.com/?from_amount=${amount}&from=${from}&to=${to}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '7ecba8f1c2msh6c407bb56160febp1630e6jsn26f2f50feace', // TODO: move the hard coded values to vault
            'X-RapidAPI-Host': 'currencyconverter.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
}

const getProduct = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const productId = req.params.id;
        const desiredCurrency = req.query.currency?.toUpperCase(); // Optional currency
        const product = await Product.get(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Convert price if currency is specified and supported
        if (desiredCurrency && ['USD','CAD', 'EUR', 'GBP'].includes(desiredCurrency)) { // Hardcoded values needs to be configurable
            if (desiredCurrency !== 'USD') {
                await getExchangeRate(product.price,'USD', desiredCurrency, (rate) => {
                    if (rate) {
                        product.price = rate;
                    }
                    res.json(product);
                });
            } else {
                res.json(product); // Same currency, no conversion needed
            }
        } else {
            res.json(product); // No currency specified or unsupported currency
        }
        res.json(product);
    } catch (err) {
        logger.error('Error getting product:', err);
        res.status(500).json('Error getting product');
    }
};

const deleteProduct = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const productId = req.params.id;
        const response = await Product.delete(productId);
        res.sendStatus(204); // No content
    } catch (err) {
        logger.error('Error deleting product:', err);
        res.status(500).json('Error deleting product');
    }
};

const updateProduct = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const productId = req.params.id;
        const updates = req.body;
        await Product.update(productId, updates)
    } catch (err) {
        logger.error('Error updating product:', err);
        res.status(500).json('Error updating product');
    }
};

const getMostViewedProducts = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // Get the desired number of products (default 5)
    const limit = parseInt(req.query.limit) || 5;
    const minViews = 1; // Only include products with at least 1 view

    const topProducts = await Product.getMostViewed(minViews, limit);
    res.sendStatus(200); // OK

    // Convert prices to specified currency if provided
    const currency = req.query.currency;
    if (currency) {
        topProducts.forEach(p => (p.price = convertPrice(p.price, currency)));
    }
    res.json(topProducts);
};

module.exports = {createProduct, getProduct, updateProduct, deleteProduct, getMostViewedProducts};