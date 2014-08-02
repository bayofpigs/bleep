/* 
 * Routes for setup page
 */

var express = require('express');
var router = express.Router();

/* GET setup page */
router.get('/posts', function(req, res) {
  res.send("This is posts page");
});

/* Redirect route to setup page */
router.get('/', function(req, res) {
  res.redirect('/posts');
});

module.exports = router;