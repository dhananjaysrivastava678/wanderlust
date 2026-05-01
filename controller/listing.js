const List = require("../model/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const ExpressError = require("../utils/ExpressError.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.Index= async(req,res)=>{
    const dinfo=await  List.find({});
    res.render("index.ejs",{dinfo});
}

module.exports.getshowForm =(req,res)=>{   
    res.render("form.ejs");
}

module.exports.detailofCard =async (req,res)=>{
    let {id}=req.params;
    console.log(id);
    let data=await List.findById(id).populate({path:"reviews",populate:{path:"author",},
    }).populate("owner");
    if(!data){
        req.flash('error','this page does not exist');
        return res.redirect("/listing"); 
    }
    console.log(data);
    res.render("show.ejs",{data,mapToken});
}

module.exports.getReqEdit = async(req,res)=>{   //add here
    let {id}=req.params;
    console.log(id);
    let data= await List.findById(id);
    // console.log(id);
    // console.log(data);
      if (!data) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");   // ✅ return added
    }
    res.render("edit.ejs",{data});
}

module.exports.postReqEdit = async (req,res)=>{
    let {id}=req.params;

    console.log(req.body);
        let response = await geocodingClient.forwardGeocode({
        query: req.body.List.location,
        limit: 1
    }).send();

    await List.findByIdAndUpdate(id,{...req.body.List, 
    geometry: response.body.features[0].geometry });
    req.flash("success", "Edit Accepted");
    res.redirect("/listing");
}

module.exports.postshowForm=async (req,res,next)=>{        
        
    let response  = await geocodingClient.forwardGeocode({
    query: req.body.List.location,
    limit: 1
    })
    .send();

        const newlisting =new List(req.body.List);
        newlisting.owner = req.user._id;
        newlisting.geometry = response.body.features[0].geometry;
        req.flash("success", "new listing added successfully")
        let savedlisting = await newlisting.save();
        console.log(savedlisting);
        res.redirect("/listing");
}

module.exports.delete = async(req,res)=>{          //add here
    let {id}= req.params;
    let deletedListing=await List.findByIdAndDelete(id);
    req.flash("success", "List Deleted Successfully");
    console.log(id);
    console.log(deletedListing);
    res.redirect("/listing");
}