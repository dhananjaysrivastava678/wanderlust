const Review = require("../model/review");
const List =require("../model/listing.js");
const review =require("../model/review.js");


module.exports.addReview = async(req,res)=>{
    let listing = await List.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    req.flash("success", "Review Added Successfully");
    await listing.save();

    console.log("review is daved");
    res.redirect(`/listing/${req.params.id}`);

}

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId}= req.params;
    await List.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review Delete Successfully");
    await review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}