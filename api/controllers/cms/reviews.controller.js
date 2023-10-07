const {showError} = require("../../lib/index.js");
const { Review } = require("../../models/index.js");

class ReviewsController {
    index = async(req, res, next) =>{
        try{
            let reviews = await Review.aggregate([
                {$lookup: {from: 'products', localField:'product_id', foreignField: '_id', as: 'product'}},
                {$lookup: {from: 'users', localField:'user_id', foreignField: '_id', as: 'user'}},
            ]).exec()

            reviews = reviews.map(review =>{
                return {
                    _id: review._id,
                    user_id: review.user_id,
                    product_id: review.product_id,
                    rating: review.rating,
                    comment: review.comment,
                    product: review.product[0],
                    user: review.user[0],
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    __v: review.__v,

                }
            })

            res.json(reviews)
        }catch(err){
            showError(err, next)
        }
    }
    

    destroy = async(req, res, next) =>{
        try{
            await Review.findByIdAndRemove(req.params.id)

            res.json({
                success: "Review removed."
            })
        }catch(err){
            showError(err, next)
        }
    }
}

module.exports = new ReviewsController