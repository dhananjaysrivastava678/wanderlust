const User = require("../model/user");

module.exports.getReqSignup = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postReqSignup = async(req,res,next)=>{
    try{
        let {username,email,password}= req.body;
        const newUser = new User({username,email});
        const registerUser = await User.register(newUser, password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
        req.flash("success","Welcome to Wonderlust");
        res.redirect("/listing");
        });
        return ; 
    }catch(err){
        req.flash("error","this username already exist");
        res.redirect("/signup");
    }
}

module.exports.getReqlogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postReqlogin =  async(req,res)=>{
        req.flash("success","hey there ! welcome to wonderlust");
        let redirectUrl = res.locals.redirectUrl || "/listing"; 
        res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
 req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","you are log out");
    res.redirect("/listing");
 });
}