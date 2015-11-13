var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

router.get('/graph', function(req, res) {
 res.render('graph', {title: 'D3 Sample'});
});

module.exports = router;

