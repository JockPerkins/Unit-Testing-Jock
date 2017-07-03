var express = require('express');
var async = require('async');
var router = express.Router();

router
  .get('/testapi/', function(req, res, next){
    console.log('testapi');
    res.sendStatus(200);
  })
  .get('/testapi/', function(req, res, next){
    console.log('testapi2');
    res.sendStatus(500);
  })

module.exports = router;
