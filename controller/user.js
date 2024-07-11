const User= require("../models/user");
const ExpressError= require('../util/ExpressError');

module.exports.getLogin= async (req, res) => {
    res.render('users/login');
};
module.exports.getSignup= async (req, res) => {
    res.render('users/signup');
};

module.exports.postLogin= async (req, res, next) => {
    req.flash('success', "Welcome back to Airbnb!");
    res.redirect(res.locals.redirect || '/listings');
};

module.exports.postSignup= async (req, res) => {
    try{
    const {username, email, password} = req.body;
    const newUser= new User({email, username});
    const registeredUser= await User.register(newUser, password);
    req.login(registeredUser, (err)=> {
        if(err) return next(err);
        req.flash('success', 'Account created successfully. Welcome to Airbnb!');
        res.redirect('/listings');
    });
    } catch(err) {
        req.flash('error', err.message);
        return res.redirect('/signup');
    };
};

module.exports.logout= async (req, res) => {
    req.logout((err)=> {
        if(err) return next(err);
        req.flash('success', "Logged out successfully!");
        res.redirect('/listings');
    });
};