var express = require('express');
var router = express.Router();
import async from 'async';
import { exec } from 'child_process';
import { development } from '../knexfile';
const knex = require('knex')(development);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/lookup/:id', function(req, res, next) {
  knex('families')
  .innerJoin('members', 'families.id', 'members.family_id')
  .where({'families.id': 3694966261})
  .asCallback(function(err, rows) {
    if (err) return next(err);
    res.status(200);
    res.json({rows});
  });
  
});
router.get('/fetch/:id', function(req, res, next) {

  // console.log(req.headers.ldscookie);
  
  knex('families')
  .innerJoin('members', 'families.id', 'members.family_id')
  .where({'families.id': req.params.id})
  .asCallback(function(err, rows) {
    if (err) return next(err);

    if (rows.length === 0) {
      fetchMember(req.params.id, req.headers.ldscookie, (err, json) => {
        if (err) return next(err);

        console.log(json);
        res.status(200);
        res.json({json});
      });
    } else {
      res.status(200);
      res.json({rows});
    }
  });
});

const fetchMember = (id, ldscookie, callback) => {
  fetchMemberFromLdsOrd(id, ldscookie, (err, parsedJson) => {
    const family_id = id;
    const house = {...parsedJson.house, family_id, type: 'house'};
    const hoh = {...parsedJson.hoh, family_id, type: 'hoh'};
    const spouse = {...parsedJson.spouse, family_id, type: 'spouse'};
    const family = {id};

    const tasks = [
      (cb) => knex.insert(house).into('members').asCallback((err, rows) => {
        cb(err);
      }), 
      (cb) => knex.insert(hoh).into('members').asCallback((err, rows) => {
        cb(err);
      }), 
      (cb) => knex.insert(spouse).into('members').asCallback((err, rows) => {
        cb(err);
      }), 
      (cb) => knex.insert(family).into('families').asCallback((err, rows) => {
        cb(err);
      }), 
    ];

    async.series(tasks, (err) => {
      callback(err, parsedJson);
    });
  });
}

const fetchMemberFromLdsOrd = (id, ldscookie, callback) => {
  // const parsedJson = JSON.parse('{ "house": { "address": "132 S Dry Creek Ln Vineyard, Utah 84058-5680 84058-5680", "name": "Vezzani", "phone": "209-756-9769", "email": "dcvezzani@gmail.com" }, "hoh": { "address": "null null null", "name": "Vezzani, David Curtis", "phone": "209-756-9688", "email": "dcvezzani@gmail.com" }, "spouse": { "address": "null null null", "name": "Vezzani, Juventa Eileen", "phone": "209-756-9769", "email": "jvezzani@gmail.com" } }');
  // callback(null, parsedJson);
 
  const cmd = `curl 'https://www.lds.org/directory/services/web/v3.0/mem/householdProfile/${id}?imageSize=MEDIUM' -H $'cookie: ${ldscookie}' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36' -H 'accept: application/json, text/javascript, */*; q=0.01' -H 'referer: https://www.lds.org/directory/?lang=eng' -H 'authority: www.lds.org' -H 'x-requested-with: XMLHttpRequest' --compressed | jq '[ {"key": "house", "value": ([{"key": "address", "value": "\\(.householdInfo.address.addr1) \\(.householdInfo.address.addr2) \\(.householdInfo.address.postal)"}, {"key": "name", "value": .householdInfo.name}, {"key": "phone", "value": .householdInfo.phone}, {"key": "email", "value": .householdInfo.email}] | from_entries)}, {"key": "hoh", "value": ([{"key": "address", "value": "\\(.headOfHousehold.address.addr1) \\(.headOfHousehold.address.addr2) \\(.headOfHousehold.address.postal)"}, {"key": "name", "value": .headOfHousehold.name}, {"key": "phone", "value": .headOfHousehold.phone}, {"key": "email", "value": .headOfHousehold.email}] | from_entries)}, {"key": "spouse", "value": ([{"key": "address", "value": "\\(.spouse.address.addr1) \\(.spouse.address.addr2) \\(.spouse.address.postal)"}, {"key": "name", "value": .spouse.name}, {"key": "phone", "value": .spouse.phone}, {"key": "email", "value": .spouse.email}] | from_entries)} ] | from_entries'
`

  exec(cmd, (err, stdout, stderr) => {
    const json = stdout.replace(/\n/g, '');
    const parsedJson = JSON.parse(json);
    callback(err, parsedJson);
  });
};

module.exports = router;
