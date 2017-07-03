var express = require('express');
var async = require('async');
var router = express.Router();

router
  .get('/testapi/', function(req, res, next){
    console.log('noapi');
    res.sendStatus(200);
  })

module.exports = router;
