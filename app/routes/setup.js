/* 
 * Routes for setup page
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* GET setup page */
router.get('/setup', function(req, res) {
  res.render('index');
});

/* Redirect route to setup page */
router.get('/', function(req, res) {
  res.redirect('/setup');
});


router.post('/setup', function(req, res) {
  console.log(req.body);
  res.send("Derp");
});

module.exports = router;