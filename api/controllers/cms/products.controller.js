const { showError } = require("../../lib/index.js");
const { Product } = require("../../models/index.js");
const { unlink } = require("node:fs/promises")

class ProductController {
    index = async (req, res, next) =>{
        try{
            const products = await Product.aggregate([
                {$lookup: {from: 'categories', localField: 'category_id', foreignField: '_id', as: 'category'}},
                {$lookup: {from: 'brands', localField: 'brand_id', foreignField: '_id', as: 'brand'}},
            ]).exec()

            res.json(products.map(product =>{
                return {
                    _id: product._id,
                    name: product.name,
                    summary: product.summary,
                    description: product.description,
                    price: product.price,
                    discounted_price: product.discounted_price,
                    category_id: product.category_id,
                    brand_id: product.brand_id,
                    images: product.images,
                    status: product.status,
                    featured: product.featured,
                    category: product.category[0],
                    brand: product.brand[0],
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    __v: product.__v
                }
            }))
        }catch(err){
            showError(err, next)
        }
    }

    store = async (req, res, next) =>{
        try{
            const {name, description, summary, price, discounted_price, category_id, brand_id, status, featured} = req.body

            const images = req.files.map(file => file.filename)

            await Product.create({name, description, summary, price, discounted_price, category_id, brand_id, status, featured, images})

            res.json({
                success: "Product added"
            })

        }catch(err){
            console.log(err)
            showError(err, next)
        }
    }

    show = async (req, res, next) =>{
        try{
            const product = await Product.findById(req.params.id)

            res.json(product)
        }catch(err){
            showError(err, next)
        }
    }

    update = async (req, res, next) =>{
        try{
            const product = await Product.findById(req.params.id)

            const {name, description, summary, price, discounted_price, category_id, brand_id, status, featured} = req.body

            let images
            if(req.files.length){
                images = [...product.images, ...req.files.map(file => file.filename)]
            }else{
                images = product.images
            }

            await Product.findByIdAndUpdate(product._id, {name, description, summary, price, discounted_price, category_id, brand_id, status, featured, images})

            res.json({
                success: "Product updated"
            })

        }catch(err){
            showError(err, next)
        }
    }

    destroy = async (req, res, next) =>{
        try{
            const product = await Product.findById(req.params.id)

            for (let image of product.images){
                await unlink(`uploads/${image}`)
            }

            await Product.findByIdAndDelete(req.params.id)

            res.json({
                success: "Product removed."

            })
        }catch(err){
            showError(err, next)
        }
    }

    image = async (req, res, next) =>{
        try{
            const product = await Product.findById(req.params.id)

            if(product.images.length > 1){
                
                await unlink(`uploads/${req.params.filename}`)

                const images = product.images.filter(image => image != req.params.filename)

                await Product.findByIdAndUpdate(req.params.id, {images})

                res.json({
                    success: "Product image removed."

                })
            }else{
                next({
                    message:"Atleast one image is required in Product.",
                    status: 403
                })
            }
        }catch(err){
            showError(err, next)
        }  
    }
}

module.exports = new ProductController;