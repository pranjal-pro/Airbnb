const express= require('express');
const router= express.Router({mergeParams: true});
const reviewController= require("../controller/review");
const wrapAsync = require('../util/wrapAsync');
const {validateReview, isLogedIn, isReviewOwner}= require('../middleware');

router.post('/', isLogedIn, validateReview, wrapAsync(reviewController.postReview));
router.delete('/:reviewId', isLogedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;