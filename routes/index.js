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

router.get('/contact-info', function(req, res, next) {
	var data = req.query.data;
	console.log(`contactInfo:`, req.query, data);

	const parts = data.split(/:/);
  res.json({lastname: parts[0], phone: parts[1], email: parts[2]});
});

router.post('/contact-visits', function(req, res, next) {
	var lastname = Object.keys(req.body)[0];
	var calendarEntries = req.body[lastname];
	
	const parts = calendarEntries.trim().split(/visit/);
	let dateTimes = null;
	_.each(parts, part => {
		const jsonStr = part.replace(/^ ([^ ]+).*\nScheduled: ([^ ]+ [^,]+, [^ ]+) at ([^ ]+ [^ ]+).*$/gm, '{"lastname": "$1", "date": "$2", "time": "$3"}').trim();
		if (jsonStr.length > 0) {
			const entry = JSON.parse(jsonStr);
			if (entry.lastname === lastname) {
				dateTimes = entry;
			}
		}
	});
  res.json(dateTimes);
});

module.exports = router;
