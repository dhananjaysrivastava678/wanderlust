const mongoose= require("mongoose");
const Listing = require("../model/listing.js");
const initdata = require("./data.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //extra line 
require('dotenv').config({path:"../.env"});

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });  //extra line

main()
.then(res=>{
    console.log("connection is stablished");
}).catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/applist');
await mongoose.connect(process.env.ATLASDB_URL);
}

const initdb = async ()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj,owner:'69ed4e494b229a7daf839bb8'}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}
// const initdb = async () => {
//     await Listing.deleteMany({});

//     // ✅ loop each listing and fetch coordinates
//     for (let obj of initdata.data) {
//         let response = await geocodingClient.forwardGeocode({
//             query: obj.location,
//             limit: 1
//         }).send();

//         obj.geometry = response.body.features[0].geometry;  // ✅ add geometry
//         obj.owner = '69ed4e494b229a7daf839bb8';
//     }

//     await Listing.insertMany(initdata.data);
//     console.log("data was initialized with coordinates");
// }

initdb();

