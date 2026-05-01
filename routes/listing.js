const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const List =require("../model/listing.js");
const {loggedin,isOwner,validateListing} = require("../middleware.js");
const { populate } = require("../model/review.js");
const constrollerListing = require("../controller/listing.js");
const { post } = require("./user.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


//index route
router.get("/",wrapAsync(constrollerListing.Index));

//render the form to add new list 
router.get("/abhay",loggedin,constrollerListing.getshowForm);

//print the detail of the specific id
router.get("/:id",wrapAsync(constrollerListing.detailofCard));

//to edit the detail
router.get("/:id/edit",loggedin,wrapAsync(constrollerListing.getReqEdit));

//EDIT ROUTE               add here
router.put("/:id",loggedin,isOwner,wrapAsync(constrollerListing.postReqEdit));

//POST TO DELETE
router.delete("/:id",loggedin,isOwner,wrapAsync(constrollerListing.delete));

//accept the post request of the form
router.post("/",loggedin,validateListing,wrapAsync(constrollerListing.postshowForm));

// //for multer to upload the file 
// router.post('/',upload.single('List[image]'), (req, res)=>{
//     res.send(req.file);
// })

module.exports = router;