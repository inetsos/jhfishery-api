var express  = require('express');
var router   = express.Router();
var Unstoring  = require('../models/Unstoring');
var util     = require('../util');

// create
router.post('/', function(req,res,next) { 
    var newUnstoring = new Unstoring(req.body);
    newUnstoring.save(function(err, unstoring){
        res.json(err || !unstoring ? util.successFalse(err) : util.successTrue(unstoring));
    });
});

// destroy
router.delete('/:id', util.isLoggedin, function(req,res,next){
    Unstoring.findOneAndRemove({_id:req.params.id}).exec(function(err,unstoring) { 
        res.json(err || !unstoring? util.successFalse(err) : util.successTrue(unstoring));
    });
});

module.exports = router;
