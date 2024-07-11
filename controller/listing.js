const { query } = require("express");
const Listing= require("../models/listing");
const Review= require("../models/reviews");
const ExpressError= require('../util/ExpressError');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

module.exports.getListings= async (req, res)=> {
    const allListings= await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.postListing= async (req, res)=> {
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    
    const listing= req.body.listing;
    if(!req.file) throw new ExpressError(404, "Image not found");
    const url= req.file.path;
    const filename= req.file.originalname;
    listing.image= {url, filename};
    listing.geometry= response.body.features[0].geometry;
    const newListing= new Listing(listing);
    newListing.owner= req.user._id;
    console.log(listing);
    console.log(newListing);
    await newListing.save();
    req.flash('success', 'Listing Added');
    res.redirect("/listings");
};

module.exports.getListing= async (req, res)=> {
    let listingId= req.params.id;
    const listing= await Listing.findById(listingId).populate({path: 'reviews', populate: {path: 'owner'}}).populate('owner');
    if(!listing){
        req.flash('error', 'Listing Not Found');
        res.redirect("/listings");
    }
    res.render("listings/show", {listing});
};

module.exports.putListing= async (req, res)=> {
    let listingId= req.params.id;
    const listing= req.body.listing;
    if(req.file) {
        const url= req.file.path;
        const filename= req.file.originalname;
        listing.image= {url, filename};
        await Listing.findByIdAndUpdate(listingId, {...listing});
    }else await Listing.findByIdAndUpdate(listingId, {...listing});
    req.flash('success', 'Listing Updated');
    res.redirect("/listings");
};

module.exports.deleteListing= async (req, res)=> {
    let listingId= req.params.id;
    await Listing.findByIdAndDelete(listingId);
    req.flash('success', 'Listing Deleted');
    res.redirect("/listings");
};

module.exports.newListing= async (req, res)=> {
    res.render("listings/new");
};

module.exports.editListing = async (req, res)=> {
    let listingId= req.params.id;
    const listing= await Listing.findById(listingId);
    if(!listing){
        req.flash('error', 'Listing Not Found');
        res.redirect("/listings");
    }
    let image= listing.image.url;
    res.render("listings/edit", {listing, image: image.replace('/upload', '/upload/w_250')});
};