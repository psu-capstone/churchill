// set up
var express  = require('express');
var app      = express();                                       // create our app w/ express
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
};

// configuration
// Change to /public/build if you want to point to gulped files
app.use(express.static(__dirname + '/public/dev'));             // set the static files location
app.use(morgan('dev'));                                         // log every request to the console
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(allowCrossDomain);

// listen (start app with node server.js)
app.listen(3000);
console.log("App listening on port 3000");
