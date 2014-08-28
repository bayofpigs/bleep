/*
 * Routes for the blog administration page
 */
var express = require('express');
var Router = express.Router;
var authGenerator = require('../util/authentication');
var controllerGenerator = require('../controllers/admin');
var session = require('express-session');
var cookieParser = require('cookie-parser');

module.exports = function(db) {
  var router = new Router();
  var controller = controllerGenerator(db);
  var auth = authGenerator(db);

  /* Session middleware */
  router.use(auth);
  router.use(cookieParser());
  router.use(session({secret: "BleepBleepBleep", 
                   resave: true,
                   saveUninitialized: true,
                   cookie: {
                    secure: true
                   } }))

  router.get('/', controller.home);
  router.get('/page/:page', auth.ensureAuthenticated, controller.page);
  router.get('/login', controller.login);
  router.post('/login', controller.handleLogin);

  router.get('/compose', function(req, res) {
    res.send("This is where the admin will write his/her beautiful writing");
  })

  return router;
}