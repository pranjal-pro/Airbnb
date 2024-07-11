if(process.env.NODE_ENV !== 'production')
    require('dotenv').config();
const express= require('express');
const mongoose= require('mongoose');
const path= require('path');
const ejs= require('ejs');
const ejsMate= require('ejs-mate');
const methodOverride= require('method-override');
const cookieParser= require('cookie-parser');
const session= require('express-session');
const MongoStore = require('connect-mongo');
const flash= require('connect-flash');
const passport= require('passport');
const LocalStrategy= require('passport-local');

const listingRouter= require('./routes/listing');
const reviewRouter= require('./routes/review');
const userRouter= require('./routes/user');
const User= require('./models/user');
const { error } = require('console');
const ExpressError= require('./util/ExpressError');

const app= express(); 
const port= 3000;
const dbURL= process.env.ATLASDB_URL;

const store= MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
        algorithm: 'aes-256-cbc',
        ivLength: 16
    },
    touchAfterDelay: 24 * 60 * 60,
});

store.on('error', ()=> {
    console.log("Error in MongoSessionStore");
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now()+ 1000* 60* 60* 24* 7,
        maxAge: 1000* 60* 60* 24* 7,
        httpOnly: true
    }
};

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    res.locals.currUser= req.user;
    next();
});

async function main(){
    await mongoose.connect(dbURL);
}
main()
    .then(()=> {console.log("DB Connected..!");})
    .catch((err)=> {console.error(err);});

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, "public", "homepage.html"));
});
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.all('*', (req, res, next)=>{
    next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode= 500, message= "Something Went Wrong"}= err;
    res.status(statusCode).render('error',{statusCode,message});
});

app.listen(port, ()=> {
    console.log(`Airbnb running on port: ${port}.`);
});