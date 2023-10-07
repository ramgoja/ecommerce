const { Schema, model } = require("mongoose");

const Product =model('Product', new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discounted_price: {
        type: Number,
        default: 0,
    },
    images: {
        type: [String],
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'categories'
    },
    brand_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'brands'
    },
    featured: {
        type: Boolean,
        default: false
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
module.exports = Product;