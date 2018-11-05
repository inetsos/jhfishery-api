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

// update
router.put('/:id', util.isLoggedin, function(req,res,next){
    Unstoring.findOne({_id:req.params.id}).exec(function(err,unstoring){
        if( err || !unstoring ) 
            return res.json(util.successFalse(err));

        for(var p in req.body) {
            unstoring[p] = req.body[p];
        }

        // save updated user
        unstoring.save(function(err, unstoring) {
            if( err || !unstoring ) return res.json(util.successFalse(err));
            else {
                res.json(util.successTrue(unstoring));
            }
        });
    });
});

// destroy
router.delete('/:id', util.isLoggedin, function(req,res,next){
    Unstoring.findOneAndRemove({_id:req.params.id}).exec(function(err,unstoring) { 
        res.json(err || !unstoring? util.successFalse(err) : util.successTrue(unstoring));
    });
});

module.exports = router;
