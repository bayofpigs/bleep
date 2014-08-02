/* 
 * Routes for setup page
 */

var express = require('express');
var router = express.Router();

/* GET setup page */
router.get('/setup', function(req, res) {
  res.render('index');
});

/* Redirect route to setup page */
router.get('/', function(req, res) {
  res.redirect('/setup');
});

router.post('/setup', function(req, res) {
  console.log(req.body);
});

module.exports = router;