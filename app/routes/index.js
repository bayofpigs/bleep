/* 
 * Routes for the blog index
 */

var express = require('express');
var Router = express.Router;
var controllerGenerator = require('../controllers/post');

module.exports = function(db) {
  var router = Router();
  var controller = controllerGenerator(db);

  /* GET setup page */
  router.get('/posts/:page', controller.postPage);

  /* Redirect route to setup page */
  router.get('/', controller.index);

  return router;
};