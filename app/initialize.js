var path = require('path');
var express = require('express');
var morgan = require('morgan');

// Universal configuration settings
module.exports = function(app) {
  app.set('view engine', 'jade');

  // ----------- Universal statics --------------
  app.use(express.static(path.join(__dirname, 'assets/shared')));

  // ----------- Other middleware
  app.use(morgan('combined'));

  // ------------ Local settings
  app.locals.pretty = true;

  // ----------- Error Handlers ---------------
  
  // Denote the end of the middleware stack. Ready to insert
  // dynamic statics and routers afterwards
  app.use(function endOfMiddlewareMarker(req, res, next) {
    next();
  });
  
  // Catch 404 errors
  app.use(function(req, res, next) {
    console.log("Caught 404");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Error handlers
  // For production
  app.use(function(err, req, res, next) {
    console.log("Caught error");
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  // Set process port
  app.set('port', process.env.PORT || 3000);
}