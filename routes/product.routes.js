const express = require('express');
const productControllers = require('../controllers/product.controller');
const router = express.Router();

router.post('/products', productControllers.createProduct);
router.get('/products/:id', productControllers.getProduct);
router.put('/products/:id', productControllers.updateProduct);
router.delete('/products/:id', productControllers.deleteProduct);

module.exports = router;


