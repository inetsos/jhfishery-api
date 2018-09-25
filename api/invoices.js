var express  = require('express');
var router   = express.Router();
var Invoice  = require('../models/Invoice');
var util     = require('../util');
var moment = require('moment');

// index
router.get('/', util.isLoggedin, function(req,res,next){
    Invoice.find({}).sort({in_date:-1, invoice:1}).exec(function(err,invoices){
        res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    });
});

router.get('/:today', function(req,res,next) {
    const str = req.params.today.split('-');
    const year = Number(str[0]);
    const month = Number(str[1]) - 1;
    const date = Number(str[2]);

    var today =  new Date(year, month, date);

    var start = moment(today).format('YYYY-MM-DD');
    var tomorrow = moment(moment(today).add(1, 'days')).format('YYYY-MM-DD');

    Invoice.find({in_date:{$gte: start, $lt: tomorrow}}).sort({invoice:1}).exec(function(err,invoices) {
        res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    });
});


/////////////////////////////////////////////////

// // create
// router.post('/', function(req,res,next){
//     var newUser = new User(req.body);
//     newUser.save(function(err,user){
//         res.json(err||!user? util.successFalse(err): util.successTrue(user));
//     });
// });

// // show
// router.get('/:userID', util.isLoggedin, function(req,res,next){
//     User.findOne({userID: req.params.userID}).exec(function(err,user) {
//         res.json( err || !user ? util.successFalse(err) : util.successTrue(user));
//     });
// });

// // update
// router.put('/:userID', util.isLoggedin, checkPermission, function(req,res,next){
//     User.findOne({userID:req.params.userID}).select({password:1}).exec(function(err,user){
//         if( err || !user ) 
//             return res.json(util.successFalse(err));

//         // update user object
//         user.originalPassword = user.password;
//         user.password = req.body.newPassword ? req.body.newPassword : user.password;
//         for(var p in req.body) {
//             user[p] = req.body[p];
//         }

//         // save updated user
//         user.save(function(err,user) {
//             if( err || !user ) return res.json(util.successFalse(err));
//             else {
//                 user.password = undefined;
//                 res.json(util.successTrue(user));
//             }
//         });
//     });
// });

// // destroy
// router.delete('/:userID', util.isLoggedin, checkPermission, function(req,res,next){
//     User.findOneAndRemove({userID:req.params.userID}).exec(function(err,user) { 
//         res.json(err||!user? util.successFalse(err): util.successTrue(user));
//     });
// });

module.exports = router;

// private functions
function checkPermission(req,res,next) {
    User.findOne({userID: req.params.userID}, function(err,user){
        if( err || !user ) 
            return res.json(util.successFalse(err));
        else if(!req.decoded || user._id != req.decoded._id) 
            return res.json(util.successFalse(null,'권한이 없습니다.'));
        else next();
    });
}