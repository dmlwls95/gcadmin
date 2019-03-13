// server.js

    let express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    db = require('./DB.js'),
    
    passport = require('passport'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    schedule = require('node-schedule'),
    bnpanal = require('./services/services.js').bnpanal;
    halfofyear = require('./services/services.js').halfofyear;
    logging = require('./services/services.js').logging;

    const app = express();

    // Create link to Angular build directory
    var distDir = __dirname + "/dist/";
    app.use(express.static(distDir));
    
    db();
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials",true);
        next();
      });
      

    const gcUnitRoutes = require('./routes/gcunit.route');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cors());

    app.use(passport.initialize());
    //app.use(passport.session());
    //app.use(passport.authenticate('session'));
    app.use(cookieParser('abcedf'));
    app.enable('trust proxy');
    /*app.use(session({
        secret: 'abcedf',
        resave: true,
        saveUninitialized: false
    }));*/
    require('./config/passport')(passport);
    const port = process.env.PORT || 4000;
    
    app.use('/gcUnit', gcUnitRoutes);


    j = schedule.scheduleJob('*/5 * * * * *', function(){
        //logging();
        /*bnpanal();
        console.log('수불내역업데이트완료');
        halfofyear();*/
    });

    const server = app.listen(port, function(){
        console.log('Listening on port ' + port);
    });