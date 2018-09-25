var express  = require('express');
var router   = express.Router();
var Seller     = require('../models/Seller');
var util     = require('../util');

// index
router.get('/', util.isLoggedin, function(req,res,next){
    Seller.find({}).sort({userID:1}).exec(function(err,sellers){
        res.json( err || !sellers ? util.successFalse(err) : util.successTrue(sellers));
    });
});

// create
router.post('/', function(req,res,next){
    var newSeller = new Seller(req.body);
    newSeller.save(function(err, seller){
        res.json(err || !seller ? util.successFalse(err) : util.successTrue(seller));
    });
});

// show
router.get('/:userID', util.isLoggedin, function(req,res,next){
    Seller.findOne({userID: req.params.userID}).exec(function(err, seller) {
        res.json( err || !seller ? util.successFalse(err) : util.successTrue(seller));
    });
});

// update
router.put('/:userID', util.isLoggedin, checkPermission, function(req,res,next){
    Seller.findOne({userID:req.params.userID}).select({password:1}).exec(function(err, seller){
        if( err || !seller ) 
            return res.json(util.successFalse(err));

        // update user object
        seller.originalPassword = seller.password;
        seller.password = req.body.newPassword ? req.body.newPassword : seller.password;
        for(var p in req.body) {
            seller[p] = req.body[p];
        }

        // save updated user
        seller.save(function(err,seller) {
            if( err || !seller ) return res.json(util.successFalse(err));
            else {
                seller.password = undefined;
                res.json(util.successTrue(seller));
            }
        });
    });
});

// destroy
router.delete('/:userID', util.isLoggedin, checkPermission, function(req,res,next){
    Seller.findOneAndRemove({userID:req.params.userID}).exec(function(err,seller) { 
        res.json(err || !seller? util.successFalse(err) : util.successTrue(seller));
    });
});

module.exports = router;

// private functions
function checkPermission(req,res,next) {
    Seller.findOne({userID: req.params.userID}, function(err,user){
        if( err || !user ) 
            return res.json(util.successFalse(err));
        else if(!req.decoded || user._id != req.decoded._id) 
            return res.json(util.successFalse(null,'권한이 없습니다.'));
        else next();
    });
}