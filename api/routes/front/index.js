const express = require('express');
const productRoutes = require("./product.routes.js");
const listRoutes = require("./list.routes.js");

const router = express.Router();

router.use('/product', productRoutes)

router.use(listRoutes)

module.exports = router