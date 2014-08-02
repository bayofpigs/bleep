/* 
 * Routes for setup page
 */

var express = require('express');
var router = express.Router();

/* GET setup page */
router.get('/setup', function(req, res) {
  res.send("This is setup");
});

/* Redirect route to setup page */
router.get('/', function(req, res) {
  res.redirect('/setup');
});

module.exports = router;