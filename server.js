var fs = require('fs');
var util = require('util');
var express = require('express');
var app = express();

require('./app/initialize')(app);

// Check if the configuration file exists
fs.exists('./config.json', function(configExists) { 
  // Exists configuration. 
  if (configExists) {
    console.log("Config exists. Noted.");
    require('./app/config')(app, function(err) {
      if (err) {
        console.error("Error during startup: ");
        console.error(err);
      } else {
        console.log("In callback");
        var server = app.listen(app.get('port'), function() {
          console.log("Express is now listening on port " + server.address().port);
        });
      }
    });
  } else {
    console.log("Config does not exist, launching setup");
    require('./app/configsetup')(app, function(err) {
      if (err) {
        console.error("Error during startup of setup: ");
        console.error(err);
      } else {
        console.log("In callback");
        var server = app.listen(app.get('port'), function() {
          console.log("Express is now listening on port " + server.address().port);
        });
      }
    });
  }
});