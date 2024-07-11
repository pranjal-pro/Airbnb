const express= require('express');
const router= express.Router({mergeParams: true});
const listingController= require("../controller/listing");
const wrapAsync = require('../util/wrapAsync');
const {validateListing, isLogedIn, isListingOwner}= require('../middleware.js');
const multer= require('multer');
const { storage }= require('../cloudConfig.js');
const upload= multer({storage});

router.route('/')
        .get(wrapAsync(listingController.getListings))
        .post(isLogedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.postListing));

router.get('/new',isLogedIn, wrapAsync(listingController.newListing));
router.get('/:id/edit',isLogedIn, isListingOwner, wrapAsync(listingController.editListing));

router.route('/:id')
        .get(wrapAsync(listingController.getListing))
        .put(isLogedIn, isListingOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.putListing))
        .delete(isLogedIn, isListingOwner, wrapAsync(listingController.deleteListing));

module.exports = router;