const Listing= require("../models/listing");
const Review= require("../models/reviews");
const ExpressError= require('../util/ExpressError');

module.exports.postReview = async (req, res)=> {
    let listingId= req.params.id;
    const listing= await Listing.findById(listingId);
    if(listing== null) throw new ExpressError(404, "Listing not Found");

    let newReview= new Review(req.body.review);
    newReview.owner= req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash('success', 'New Comment added');
    res.redirect(`/listings/${listingId}`);
};

module.exports.deleteReview = async (req, res)=> {
    let listingId= req.params.id;
    let reviewId= req.params.reviewId;
    await Listing.findByIdAndUpdate(listingId, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comment Deleted');
    res.redirect(`/listings/${listingId}`);
};

