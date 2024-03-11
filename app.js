const express = require('express');
const app = express();
var logger = require('morgan');
var productRouter = require('./routes/product.routes')
app.use(logger('dev'));
app.use(express.json());
app.use('/api', productRouter);

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
})
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     res.status(err.status || 404).json({
//         message: "No such route exists"
//     })
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500).json({
//         message: "Error Message"
//     })
// });

module.exports = app;
