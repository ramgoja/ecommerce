const {Cms} = require("../../controllers/index.js")
const express = require("express")
const { fileUpload } = require("../../lib/index.js")

const router = express.Router()

const mimes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']

router.route('/')
    .get(Cms.Products.index)
    .post(fileUpload(mimes).array('images'), Cms.Products.store)

    
router.route('/:id')
    .get(Cms.Products.show)
    .put(fileUpload(mimes).array('images'), Cms.Products.update)
    .patch(fileUpload(mimes).array('images'), Cms.Products.update)
    .delete(Cms.Products.destroy)


router.delete('/:id/image/:filename', Cms.Products.image)

module.exports = router