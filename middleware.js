const List = require("./model/listing");
const review = require("./model/review.js")
const ExpressError = require("./utils/ExpressError.js");
const {listSchema,reviewSchema} = require("./schema.js");

module.exports.loggedin = (req,res,next)=>{
    console.log(req);
  if(!req.isAuthenticated()){
        req.flash("error","please loing to enter");
         req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // ✅ save to locals
         req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
        let {id}=req.params;
        let listing = await List.findById(id);
        if( !listing.owner.equals(res.locals.currUser._id)){
            req.flash("error", "You are not owner...");
            return res.redirect("/listing");
        }
        next()
}

module.exports.isAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let reviewDoc = await review.findById(reviewId); // ✅ "review" is the imported model
    if(!reviewDoc){
        req.flash("error", "Review not found");
        return res.redirect(`/listing/${id}`);
    }
    if(!reviewDoc.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author...");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listSchema.validate(req.body);
    if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}