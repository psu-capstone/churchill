// set up ========================
var express  = require('express');
var app      = express();                   // create our app w/ express
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================
app.use(morgan('dev'));                                         // log every request to the console
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    var __dirname = 'public/dev';
    res.sendFile('index.html', { root: __dirname }); // load the single view file (angular will handle the page changes on the front-end)
});