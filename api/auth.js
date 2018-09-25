var express  = require('express');
var router   = express.Router();
var User     = require('../models/User');
var Seller     = require('../models/Seller');
var util     = require('../util');
var jwt      = require('jsonwebtoken');

// login
router.post('/login',
    function(req,res,next) {
        var isValid = true;
        var validationError = {
            name:'ValidationError',
            errors:{}
        };

        if(!req.body.userID){
            isValid = false;
            validationError.errors.userID = {message:'아이디를 입력하세요.'};
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'비밀번호를 입력하세요.'};
        }

        if(!isValid) 
            return res.json(util.successFalse(validationError));
        else 
            next();
    },
    function(req,res,next){
        User.findOne({userID:req.body.userID}).select({password:1,userID:1,name:1,email:1}).exec(function(err,user){
            if(err) 
                return res.json(util.successFalse(err));
            else if(!user||!user.authenticate(req.body.password))
                return res.json(util.successFalse(null,'아이디와 비밀번호를 다시 확인바랍니다.'));
            else {
                var payload = {
                    _id : user._id,
                    userID: user.userID
                };
                var secretOrPrivateKey = process.env.JWT_SECRET;
                var options = {expiresIn: 60*60*24};
                jwt.sign(payload, secretOrPrivateKey, options, function(err, token) {
                    if(err) 
                        return res.json(util.successFalse(err));
                    res.json(util.successTrue(token));
                });
            }
        });
    }
);

// me
router.get('/me', util.isLoggedin,
    function(req,res,next) {
        User.findById(req.decoded._id).exec(function(err,user){
            if( err || !user ) 
                return res.json(util.successFalse(err));
            res.json(util.successTrue(user));
        });
    }
);

// refresh
router.get('/refresh', util.isLoggedin,
    function(req,res,next) {
        User.findById(req.decoded._id).exec(function(err,user) {
            if( err || !user ) 
                return res.json(util.successFalse(err));
            else {
                var payload = {
                    _id : user._id,
                    userID: user.userID
                };
                var secretOrPrivateKey = process.env.JWT_SECRET;
                var options = {expiresIn: 60*60*24};
                jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
                    if(err) 
                        return res.json(util.successFalse(err));
                    res.json(util.successTrue(token));
                });
            }
        });
    }
);

// ==== seller ================================
router.post('/seller/login',
    function(req,res,next) {
        var isValid = true;
        var validationError = {
            name:'ValidationError',
            errors:{}
        };

        if(!req.body.userID){
            isValid = false;
            validationError.errors.userID = {message:'아이디를 입력하세요.'};
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'비밀번호를 입력하세요.'};
        }

        if(!isValid) 
            return res.json(util.successFalse(validationError));
        else 
            next();
    },
    function(req, res, next){
        Seller.findOne({userID:req.body.userID}).select({password:1,userID:1,name:1,email:1}).exec(function(err, seller){
            if(err) 
                return res.json(util.successFalse(err));
            else if(!seller || !seller.authenticate(req.body.password))
                return res.json(util.successFalse(null,'아이디와 비밀번호를 다시 확인바랍니다.'));
            else {
                var payload = {
                    _id : seller._id,
                    userID: seller.userID
                };
                var secretOrPrivateKey = process.env.JWT_SECRET;
                var options = {expiresIn: 60*60*24};
                jwt.sign(payload, secretOrPrivateKey, options, function(err, token) {
                    if(err) 
                        return res.json(util.successFalse(err));
                    res.json(util.successTrue(token));
                });
            }
        });
    }
);

// me
router.get('/seller/me', util.isLoggedin,
    function(req, res, next) {
        Seller.findById(req.decoded._id).exec(function(err,seller){
            if( err || !seller ) 
                return res.json(util.successFalse(err));
            res.json(util.successTrue(seller));
        });
    }
);

// refresh
router.get('/seller/refresh', util.isLoggedin,
    function(req, res, next) {
        Seller.findById(req.decoded._id).exec(function(err,seller) {
            if( err || !seller ) 
                return res.json(util.successFalse(err));
            else {
                var payload = {
                    _id : seller._id,
                    userID: seller.userID
                };
                var secretOrPrivateKey = process.env.JWT_SECRET;
                var options = {expiresIn: 60*60*24};
                jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
                    if(err) 
                        return res.json(util.successFalse(err));
                    res.json(util.successTrue(token));
                });
            }
        });
    }
);

module.exports = router;