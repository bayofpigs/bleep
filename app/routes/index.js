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
  router.get('/posts', controller.postDefault);
  router.get('/post/:id', controller.postIndividual);
  router.get('/post/:id/:title', controller.postIndividual);
  
  router.get('/archive', controller.archive);
  router.get('/archive/:year/:month', controller.archiveByDate);
  /* Redirect route to setup page */
  router.get('/', controller.index);

  return router;
};