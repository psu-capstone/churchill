var express = require('express');
var router = express.Router();

/**
 * This js holds the functions for express, that handles the page loading
 * The router will locate the proper jade file corresponding to what is in
 * the render function.  You can also add the title here which would normally
 * be in the <head> tag in a normal html page
 */

// GET home page.
router.get('/', function(req, res) {
  res.render('index', { title: 'Login' });
});

router.get('/graph', function(req, res) {
 res.render('graph', {title: 'D3 Sample'});
});

module.exports = router;

