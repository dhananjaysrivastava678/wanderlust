const mongoose = require("mongoose");
const review = require("./review.js");
const { string } = require("joi");

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type:String,
        default:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        set: (v) => v === "" 
        ?  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" : v,
    }, 
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
   geometry: {
    type: {
        type: String,
        enum: ['Point'],
    },
    coordinates: {
        type: [Number],
    }
}
});

listSchema.post("findOneAndDelete" ,async(listing) =>{
    if(listing){
        await review.deleteMany({_id: {$in: listing.review}});
    }
});

const List = mongoose.model("List", listSchema);
module.exports = List;

    // let coordinates = <%- JSON.stringify(data.geometry.coordinates) %>;
    // let location = "<%= data.location %>";
   // let coordinates = <%- JSON.stringify(data.geometry.coordinates) %>;
//let coordinates = <%- JSON.stringify(data.geometry.coordinates) %>;
//mongodb+srv://dhananjaysrivastava678_db_user:QXH4CjSk2IOdEeKB@cluster0.tw3yaos.mongodb.net/?appName=Cluster0
