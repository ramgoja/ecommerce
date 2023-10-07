const express = require('express');
const { Front, Profile } = require("../../controllers/index.js");
const { customerOnly, auth } = require('../../lib/index.js');

const router = express.Router();

router.get('/latest', Front.Product.latest)
router.get('/featured', Front.Product.featured)
router.get('/top-selling', Front.Product.top)
router.get('/:id/similar', Front.Product.similar)
router.post('/:id/review', auth, customerOnly, Profile.rating)
router.get('/:id', Front.Product.byId)

module.exports = router