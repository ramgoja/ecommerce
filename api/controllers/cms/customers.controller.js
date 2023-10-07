const {showError} = require("../../lib/index.js");
const { User } = require("../../models/index.js");
const bcrypt = require("bcryptjs")

class CustomersController {
    index = async(req, res, next) =>{
        try{
            const customers = await User.find({type: 'Customer'}).exec()

            res.json(customers)
        }catch(err){
            showError(err, next)
        }
    }
    

    store = async(req, res, next) =>{
        try{
            const {name, email, password, confirm_password, address, phone, status} = req.body
            

            if(password==confirm_password){
                const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10))
                
                await User.create({name, email, password:hash, address, phone, status})
            
                res.json({
                    success: 'Customer added.'
                })
            }else{
                next({
                    message: 'Password not confirmed.',
                    status: 422
                })
            }

        }catch(err){
            showError(err, next)
        }
    }
    

    show = async(req, res, next) =>{
        try{
            const customer = await User.findById(req.params.id)

            res.json(customer)

        }catch(err){
            showError(err, next)
        }
    }
    
    update = async(req, res, next) =>{
        try{
            const {name, address, phone, status} = req.body
            await User.findByIdAndUpdate(req.params.id, {name, address, phone, status})

            res.json({
                success: "Customer Updated."
            })
        }catch(err){
            showError(err, next)
        }
    }
    
    destroy = async(req, res, next) =>{
        try{
            await User.findByIdAndRemove(req.params.id)

            res.json({
                success: "Customer removed."
            })
        }catch(err){
            showError(err, next)
        }
    }
}

module.exports = new CustomersController