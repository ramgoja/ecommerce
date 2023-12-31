const express = require('express')
const { Profile } = require('../../controllers/index.js')
const { customerOnly } = require('../../lib/index.js')

const router = express.Router()

router.get('/details', Profile.details)

router.get('/reviews', customerOnly, Profile.reviews)

router.get('/orders', customerOnly, Profile.orders)

router.route('/edit-profile')
    .put(Profile.edit)
    .patch(Profile.edit)

router.route('/change-password')
    .put(Profile.password)
    .patch(Profile.password)

module.exports = router