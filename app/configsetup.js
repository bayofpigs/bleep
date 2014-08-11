var path = require('path');
var express = require('express');
var statics = require('./util/staticmanager');
var routes = require('./util/routesmanager');
var setupRoutes = require('./routes/setup');
var indexRoutes = require('./routes/index');

/*
 * Configure routes, static assets and middleware to serve up the
 * form for initial application setup
 */
module.exports = function(app, callback) {
  app.set('views', path.join(__dirname, '/setupassets/views'));

  // Temporary static files directory
  //app.use('/setup', express.static(path.join(__dirname, 'setupassets/public')));
  statics.add(app, path.join(__dirname, 'setupassets/public'), '/setup');
  routes.add(app, setupRoutes, "/");
  
  //console.log(app._router.stack);

  callback(null);
}