const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const {listSchema,reviewSchema} = require("../schema.js");
const review =require("../model/review.js");
const List =require("../model/listing.js");
const { loggedin,isAuthor,validateReview } = require("../middleware.js");
const constrollerReview = require("../controller/review.js");

//accept request of review
router.post("/",loggedin,validateReview,wrapAsync(constrollerReview.addReview));

//delete the review request
router.delete("/:reviewId",loggedin, isAuthor,wrapAsync(constrollerReview.deleteReview));

module.exports = router;