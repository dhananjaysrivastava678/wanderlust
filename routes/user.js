const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { loggedin, saveRedirectUrl } = require("../middleware.js");
const controllerUser = require("../controller/user.js");

//signup route
router.get("/signup",controllerUser.getReqSignup);

 //signup route
router.post("/signup",wrapAsync(controllerUser.postReqSignup));

//get request for login form
router.get("/login",controllerUser.getReqlogin);

//post request for login
router.post("/login" ,  
    saveRedirectUrl, 
    passport.authenticate('local', 
        { failureRedirect: '/login',failureFlash:true}),controllerUser.postReqlogin);

//logout route 
router.get("/logout",controllerUser.logout);

module.exports = router;