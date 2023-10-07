const { Schema, model } = require("mongoose");

const Review =model('Review', new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'products'
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
module.exports = Review;