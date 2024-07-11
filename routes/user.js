const express= require('express');
const router= express.Router({mergeParams: true});
const userController= require("../controller/user");
const wrapAsync = require('../util/wrapAsync');
const { saveRedirectURL }= require('../middleware');
const passport = require('passport');

router.route('/login')
    .get(wrapAsync(userController.getLogin))
    .post(saveRedirectURL,
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        wrapAsync(userController.postLogin)
    );

router.route('/signup')
    .get(wrapAsync(userController.getSignup))
    .post(wrapAsync(userController.postSignup));

router.route('/logout')
    .get(wrapAsync(userController.logout));

module.exports=router;