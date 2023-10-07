const {showError} = require("../../lib/index.js");
const { Brand } = require("../../models/index.js");

class BrandsController {
    index = async(req, res, next) =>{
        try{
            const brands = await Brand.find()

            res.json(brands)
        }catch(err){
            showError(err, next)
        }
    }
    

    store = async(req, res, next) =>{
        try{
            const {name, status} = req.body
                
            await Brand.create({name, status})
            
            res.json({
                success: 'Brand added.'
            })


        }catch(err){
            showError(err, next)
        }
    }
    

    show = async(req, res, next) =>{
        try{
            const brand = await Brand.findById(req.params.id)

            res.json(brand)

        }catch(err){
            showError(err, next)
        }
    }
    
    update = async(req, res, next) =>{
        try{
            const {name, status} = req.body
            await Brand.findByIdAndUpdate(req.params.id, {name, status})

            res.json({
                success: "Brand Updated."
            })
        }catch(err){
            showError(err, next)
        }
    }
    
    destroy = async(req, res, next) =>{
        try{
            await Brand.findByIdAndRemove(req.params.id)

            res.json({
                success: "Brand removed."
            })
        }catch(err){
            showError(err, next)
        }
    }
}

module.exports = new BrandsController