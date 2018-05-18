import fs from 'fs';
import _ from 'lodash';
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

// router.get('/lookup/:id', function(req, res, next) {
//   knex('families')
//   .innerJoin('members', 'families.id', 'members.family_id')
//   .where({'families.id': 3694966261})
//   .asCallback(function(err, rows) {
//     if (err) return next(err);
//     res.status(200);
//     res.json({rows});
//   });
// });

router.get('/index', function(req, res, next) {
  fetchAllFamilies ((err, rows) => {
    if (err) return next(err);

    res.status(200);
    res.json({rows});
  });
});

router.post('/index/:id', function(req, res, next) {
  indexMembers (req.params.id, req.headers.ldscookie, (err, { json }) => {
    if (err) return next(err);

    res.status(200);
    res.json({json});
  });
});

router.get('/fetch/:id', function(req, res, next) {
  fetchMembers (req.params.id, req.headers.ldscookie, (err, { json }) => {
    if (err) return next(err);

    res.status(200);
    res.json({json});
  });
});

export const xfetchAllMembers = ({ family_id, ldscookie }, callback) => {
  knex('families')
	.leftOuterJoin('members', 'members.family_id', 'families.id')
	.select(['families.id', 'families.name', 'members.name as mname', 'members.phone', 'members.email'])
	.whereRaw('families.id = ?', [family_id])
	// .orderBy('name', 'asc')
  .asCallback((err, rows) => {
	  console.log(rows)
    callback(err, rows);
  })
};

export const fetchAllFamilies = (callback) => {
  knex('families')
	.leftOuterJoin('members', 'members.family_id', 'families.id')
	// .select(['families.id', 'families.name', 'members.name as mname', 'members.phone', 'members.email'])
	.select(['families.id', 'families.name'])
	.count('families.id as cnt')
	.groupBy('families.id', 'families.name')
	.orderBy('families.name', 'asc')
  .asCallback((err, rows) => {
    callback(err, rows);
  })
};

const indexMembers = (id, ldscookie, callback) => {
  let res = {}
  const tasks = [
    (cb) => {
      fetchIndexFromLdsOrg (id, ldscookie, (err, parsedJson) => {
        res.parsedJson = parsedJson
        cb(err);
      });
    }, 
    (cb) => {
      cacheIndex (id, res.parsedJson, (err) => {
        cb(err);
      });
    }, 
    (cb) => {
      fetchCachedIndex ((err, rows) => {
        res.cachedJson = {count: rows.length, records: rows};
        cb(err);
      });
    }, 
  ];

  async.series(tasks, (err) => {
    callback(err, {json: res.cachedJson});
  });
}

const xfetchIndexFromLdsOrg = (id, ldscookie, callback) => {
  fs.readFile('/Users/davidvezzani/Downloads/v1-member-index.json', function read(err, data) {
    // const rows = _.map(JSON.parse(data.toString()), row => {
    //   console.log({row});
    //   return {family: {headOfHouseIndividualId: row.id, coupleName: row.name}};
    // });
    
    callback(err, JSON.parse(data.toString()));
  });
}

const fetchIndexFromLdsOrg = (id, ldscookie, callback) => {
  const cmd = `curl 'https://www.lds.org/directory/services/web/v3.0/mem/member-list/${id}' -H $'cookie: ${ldscookie}' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36' -H 'accept: application/json, text/javascript, */*; q=0.01' -H 'referer: https://www.lds.org/directory/?lang=eng' -H 'authority: www.lds.org' -H 'x-requested-with: XMLHttpRequest' --compressed | jq 'map({headOfHouseIndividualId, coupleName})'`

  exec(cmd, (err, stdout, stderr) => {
    const json = stdout.replace(/\n/g, '');
    const parsedJson = JSON.parse(json);
    callback(err, parsedJson);
  });
}

const cacheIndex = (id, parsedJson, callback) => {
  const rows = _.map(parsedJson, family => {
    return {id: family.headOfHouseIndividualId, name: family.coupleName};
  });
  const chunkSize = 1000;
  let cnt = rows.length;

  // knex.batchInsert('families', rows, chunkSize)
  rows.forEach(row => {
    knex.insert(row).into('families')
    .asCallback((err, row) => {
      if (err && err.code === 'SQLITE_CONSTRAINT') err = null;

      cnt -= 1;
      if (cnt <= 0) callback(err, rows);
    })
  });
};

const fetchCachedIndex = (callback) => {
  knex('families')
  .select()
  .asCallback((err, rows) => {
    callback(err, rows);
  })
};


const cacheMember = (id, parsedJson, callback) => {
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
      if (err.code === 'SQLITE_CONSTRAINT') err = null;
      cb(err);
    }), 
  ];

  async.series(tasks, (err) => {
    callback(err, parsedJson);
  });
};

export const fetchMembers = (id, ldscookie, callback) => {
  let res = {}
  const tasks = [
    (cb) => {
      fetchMemberFromCache (id, (err, {cached, rows}) => {
        if (cached === true) {
          res['parsedJson'] = rows;
          return cb(new Error(`cached`));
        }
        
        cb(err);
      });
    }, 
    (cb) => {
      fetchMemberFromLdsOrg (id, ldscookie, (err, parsedJson) => {
        res['parsedJson'] = parsedJson;
        cb(err);
      });
    }, 
    (cb) => {
      cacheMember (id, res.parsedJson, (err) => {
        cb(err);
      });
    }, 
  ];

  async.series(tasks, (err) => {
    if (err && err.message == 'cached') {
      return callback(null, {json: res.parsedJson});
    } 
    callback(err, {json: res.parsedJson});
  });
}

const formatFamily = (rows) => {
  let res = {};
  rows.forEach(row => {
    const { address, name, phone, email } = row
    res[row.type] = { address, name, phone, email };
  });

  return res;
}

const fetchMemberFromCache = (id, callback) => {
  knex('families')
  .innerJoin('members', 'families.id', 'members.family_id')
  .where({'families.id': id})
  .asCallback(function(err, rows) {
    if (err) return callback(err);

    if (rows.length === 0) {
      return callback(null, {cached: false});
    } else {
      return callback(null, {cached: true, rows: formatFamily(rows)});
    }
  });
};

const xfetchMemberFromLdsOrg = (id, ldscookie, callback) => {
  const parsedJson = JSON.parse('{ "house": { "address": "132 S Dry Creek Ln Vineyard, Utah 84058-5680 84058-5680", "name": "Vezzani", "phone": "209-756-9769", "email": "dcvezzani@gmail.com" }, "hoh": { "address": "null null null", "name": "Vezzani, David Curtis", "phone": "209-756-9688", "email": "dcvezzani@gmail.com" }, "spouse": { "address": "null null null", "name": "Vezzani, Juventa Eileen", "phone": "209-756-9769", "email": "jvezzani@gmail.com" } }');
  callback(null, parsedJson);
};
 
const fetchMemberFromLdsOrg = (id, ldscookie, callback) => {
  const cmd = `curl 'https://www.lds.org/directory/services/web/v3.0/mem/householdProfile/${id}?imageSize=MEDIUM' -H $'cookie: ${ldscookie}' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36' -H 'accept: application/json, text/javascript, */*; q=0.01' -H 'referer: https://www.lds.org/directory/?lang=eng' -H 'authority: www.lds.org' -H 'x-requested-with: XMLHttpRequest' --compressed | jq '[ {"key": "house", "value": ([{"key": "address", "value": "\\(.householdInfo.address.addr1) \\(.householdInfo.address.addr2) \\(.householdInfo.address.postal)"}, {"key": "name", "value": .householdInfo.name}, {"key": "phone", "value": .householdInfo.phone}, {"key": "email", "value": .householdInfo.email}] | from_entries)}, {"key": "hoh", "value": ([{"key": "address", "value": "\\(.headOfHousehold.address.addr1) \\(.headOfHousehold.address.addr2) \\(.headOfHousehold.address.postal)"}, {"key": "name", "value": .headOfHousehold.name}, {"key": "phone", "value": .headOfHousehold.phone}, {"key": "email", "value": .headOfHousehold.email}] | from_entries)}, {"key": "spouse", "value": ([{"key": "address", "value": "\\(.spouse.address.addr1) \\(.spouse.address.addr2) \\(.spouse.address.postal)"}, {"key": "name", "value": .spouse.name}, {"key": "phone", "value": .spouse.phone}, {"key": "email", "value": .spouse.email}] | from_entries)} ] | from_entries'`

  exec(cmd, (err, stdout, stderr) => {
    const json = stdout.replace(/\n/g, '');
    const parsedJson = JSON.parse(json);
    callback(err, parsedJson);
  });
};

export const users = router;
