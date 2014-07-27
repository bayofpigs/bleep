var path = require('path');
var express = require('express');

/*
 * Configure routes, static assets and middleware to serve up the
 * form for initial application setup
 */
module.exports = function(app, callback) {
  app.set('views', path.join(__dirname, '/setupassets/views'));

  // Temporary static files directory
  
  console.log(app._router.stack);

  callback(null);
}