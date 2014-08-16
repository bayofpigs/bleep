/*
 * Routes for the blog administration page
 */
var express = require('express');
var Router = express.Router;
var authentication = require('../util/authentication');

module.exports = function(db) {
  var router = new Router();

  router.use(authentication(db));

  router.get('/', function(req, res) {
    res.send("This is the admin page");
  });

  router.get('/login', function(req, res) {
    res.send("This is for the admin to login");
  });

  router.get('/compose', function(req, res) {
    res.send("This is where the admin will write his/her beautiful writing");
  })

  return router;
}