const jwt = require("jsonwebtoken")
const { User } = require("../models/index.js")
const multer = require('multer')

const debug = () => process.env.DEBUG == 'true' || process.env.DEBUG == true

const showError = (error, next) =>{
    if(debug()){
    console.error(error)
    }

    next({
        message: 'problem while processing request',
        status: 400
    })
}

const auth = async(req, res, next) =>{
    if("authorization" in req.headers && req.headers.authorization.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ').pop()

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.uid = decoded.id
            req.user = await User.findById(decoded.id)

            next()

        }catch(err){
            next({
                message: 'Invalid token',
                status: 401
            })
        }
    }else{
        next({
            message: 'Token missing',
            status: 401
        })
    }
}


const adminStaff = (req, res, next) =>{
    if(req.user.type == 'Customer') {
        next({
            message : 'Access denied',
            status: 403
        })
    }
    next()
}


const adminOnly = (req, res, next) =>{
    if(req.user.type != 'Admin') {
        next({
            message : 'Access denied',
            status: 403
        })
    }
    
    next()
}


const customerOnly = (req, res, next) =>{
    if(req.user.type != 'Customer') {
        next({
            message : 'Access denied',
            status: 403
        })
    }
    
    next()
}



const fileUpload = (mimeTypes = []) => multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => callback(null, 'uploads'),
        filename: (req, file, callback) => {
            const ext = file.originalname.split('.').pop()
            const filename = Date.now() + `.${ext}`
            callback(null, filename)
        },
    }),


    fileFilter: (req, file, callback) => {
        if(mimeTypes.length > 0) {
            if(mimeTypes.includes(file.mimetype)) {
                callback(null, true)
            }else{
                callback({message: 'File type not supported.'}, false)
            }
        }else{
            callback(null, true)
        }
    }
})

module.exports = {debug, showError, auth, adminStaff, adminOnly, fileUpload, customerOnly}