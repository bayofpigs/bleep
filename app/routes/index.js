/* 
 * Routes for the blog index
 */

var express = require('express');
var Router = express.Router;

module.exports = function() {
  var router = Router();

  /* GET setup page */
  router.get('/posts', function(req, res) {
    res.send("This is posts page");
  });

  /* Redirect route to setup page */
  router.get('/', function(req, res) {
    res.redirect('/posts');
  });

  return router;
};