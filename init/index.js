if(process.env.NODE_ENV !== 'production')
    require('dotenv').config();
const mongoose= require('mongoose');
let {data}= require('./data.js');
const User= require('../models/user.js');
const Listing= require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

const dbURL= process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbURL);
}

main()
    .then(()=> {console.log("DB Connected..!");})
    .catch((err)=> {console.error(err);});

const initDB= async ()=> {
    await User.deleteMany({});
    const newUser= new User({email: 'pranjalpro12@gmail.com', username: 'pranjalpro'});
    const registeredUser= await User.register(newUser, "password");
    console.log(registeredUser);
    data= data.map(obj=> ({...obj, owner: registeredUser._id}));
    data= data.map(async obj=> {
        let location= obj.location+', '+ obj.country;
        let response= await geocodingClient.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        console.log(response);
        obj.geometry= response.body.features[0].geometry;
        return obj;
    });
    data= await Promise.all(data);
    console.log(data);
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log('Data Initialized');
}

initDB();