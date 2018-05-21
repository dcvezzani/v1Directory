var express = require('express');
var moment = require('moment');
var _ = require('lodash');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/format-time', function(req, res, next) {

	var dtsString = req.query.dts; // $_GET["id"]

	console.log(`formatDate:`, req.query, dtsString);
	
	const momnt = moment(dtsString, "MM/DD@h:ma");
	const date = momnt.format('dddd, MMMM Do YYYY');
	const time = momnt.format('h:mm a');

  res.json({date, time});
});

router.get('/format-email-addresses', function(req, res, next) {
	var addresses = req.query.addresses;
	console.log(`formatDate:`, req.query, addresses);
	var formattedAddresses = _.map(addresses.split(/,/), entry => `-c ${entry}`);

  res.send(formattedAddresses.join(" "));
});

module.exports = router;
