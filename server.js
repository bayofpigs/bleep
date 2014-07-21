var express = require('express');
var app = express();

require('./app/config')(app, function() {
  console.log("In callback");
  var server = app.listen(app.get('port'), function() {
    console.log("Express is now listening on port " + server.address().port);
  });
});