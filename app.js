if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}
console.log(`Hello ${process.env.SECRET}`)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port = 8080;
const List =require("./model/listing.js");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { expression } = require("joi");
const flash= require("session-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./model/user.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const dbUrl = process.env.ATLASDB_URL ;
const ExpressError = require("./utils/ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const validateListing = (req,res,next)=>{
    console.log("schema:" ,listSchema);
    console.log("body:", req.body);
    let {error} = listSchema.validate(req.body);
    if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,errmsg);
    }else{
        next();
    }
}

const store  = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});


store.on("error",(err)=>{
    console.log("ERROR OCCURED IN MONGO SESSION",err);
});

//setup for express-session
const sessionOption = {
    secret :process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
}
app.get("/",(req,res)=>{
    res.redirect("/listing");
});
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());        //to use passport it should initialize
app.use(passport.session());           //neccessary to use the session for passport so that user login enable for the given proper session 
passport.use(new LocalStrategy(User.authenticate()));   //local strategy is used to create the username,password and authenticate them

passport.serializeUser(User.serializeUser());       //to store the user's info in serial order
passport.deserializeUser(User.deserializeUser());   //to remove the user's info after session expiring 

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.get("/demouser", async(req,res)=>{
    const fakeuser = new User({
        email: "dhananjaysrivastav678@gmail.com",
        username: "dhanajaysrivastav678"
    });
    let registerUser =await User.register(fakeuser, "abhay678");
    res.send(registerUser);
});

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews" , reviewsRouter);
app.use("/", userRouter);


main()
.then(res=>{
    console.log("connection is stablished");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 5000,
    });
}

// 
// app.get("/listing",async (req,res)=>{
//     let samplelisting =new List({
//         title:"this is my new farmfouse",
//         description :"actually i like this farm house",
//         price:3553345,
//         image:"",
//         location: "hinapur kolkata burjjbazar"
//     });
//     await samplelisting.save();
//     console.log("sample saved");
//     res.send("api working");
// });

//for all not existing page 
app.all("*slat",(req,res,next)=>{
    next(new ExpressError(404,"not existing"));
});

//middleware for error control
app.use((err,req,res,next)=>{
    let {statusCode = 505,message="page is not found "}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});
app.listen(port,(req,res)=>{
    console.log("port is listening on the port number 8080");
});