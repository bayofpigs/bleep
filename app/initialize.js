var path = require('path');
var express = require('express');

// Universal configuration settings
module.exports = function(app) {
  app.set('view engine', 'jade');


  // ----------- Universal statics --------------
  app.use(express.static(path.join(__dirname, 'assets/shared/')));
  app.use(express.static(path.join(__dirname, 'assets/themes/default/static')));

  // ----------- Error Handlers ---------------
  // Catch 404 errors
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Error handlers
  // For production
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  // Set process port
  app.set('port', process.env.PORT || 3000);
}