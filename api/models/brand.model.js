const { Schema, model } = require("mongoose");

const Brand =model('Brand', new Schema({
    name: {
        type: String,
        required: true
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
}))
module.exports = Brand;