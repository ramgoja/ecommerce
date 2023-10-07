const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        maxlength: 30,
    },
    address: {
        type: String,
        required:true
    },
    type: {
        required: true,
        type: String,
        enum: ['Admin','Staff','Customer'],
        default: 'Customer',
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
})

const user = model('user', userSchema);
module.exports = user;