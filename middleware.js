const {listingSchema, reviewSchema}= require("./schema");
const ExpressError= require('./util/ExpressError');
const Listing= require('./models/listing');
const Review= require('./models/reviews');

module.exports.validateListing= (req, res, next)=>{
    const {error}= listingSchema.validate(req.body);
    if(error) {
        let errMsg= error.details.map((el)=> el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else next();
}
module.exports.validateReview= (req, res, next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error) {
        let errMsg= error.details.map((el)=> el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else next(error);
}

module.exports.isLogedIn= (req, res, next)=>{
    req.session.redirect= req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error', 'Please Login before Continuing');
        res.redirect('/login');
    }else next();
};

module.exports.saveRedirectURL= (req, res, next)=>{
    res.locals.redirect= req.session.redirect;
    next();
};

module.exports.isListingOwner= async (req, res, next)=>{
    let id= req.params.id;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not Listing Owner..!');
        res.redirect(`/listings`);
    }
    next();
};

module.exports.isReviewOwner= async (req, res, next)=>{
    let id= req.params.reviewId;
    let review= await Review.findById(id);
    if(!review.owner.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not Review Owner..!');
        res.redirect(`/listings/${req.params.id}`);
    }
    next();
};