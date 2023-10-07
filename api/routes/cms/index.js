const { adminOnly } = require("../../lib/index.js");
const staffsRoutes = require("./staffs.routes.js");
const brandsRoutes = require("./brands.routes.js");
const categoriesRoutes = require("./categories.routes.js");
const productsRoutes = require("./products.routes.js");
const customersRoutes = require("./customers.routes.js");
const reviewsRoutes = require("./reviews.routes.js");
const ordersRoutes = require("./orders.routes.js");
const express = require("express");

const router = express.Router()

router.use('/staffs',adminOnly ,staffsRoutes)

router.use('/brands', brandsRoutes)

router.use('/categories', categoriesRoutes)

router.use('/products', productsRoutes)

router.use('/customers', customersRoutes)

router.use('/reviews', reviewsRoutes)

router.use('/orders', ordersRoutes)


module.exports = router