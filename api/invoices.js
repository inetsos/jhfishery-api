var express  = require('express');
var router   = express.Router();
var Invoice  = require('../models/Invoice');
var Unstoring  = require('../models/Unstoring');
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

    // Invoice.find({in_date:{$gte: start, $lt: tomorrow}}).populate('unstoring').sort({invoice:1}).exec(function(err,invoices) {
    //     res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    // });

    // 입력한 날 이후 모든 데이터를 보여주도록 한다.  20181009
    Invoice.find( { $and: [ {in_date:{$gte: start}}, { $where: function() { return (this.in_number !== this.out_number);}} ]})
        .populate('unstoring').sort({invoice:1}).exec(function(err,invoices) {
            //console.log(invoices);
            res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    });
});

router.get('/:today/all', function(req,res,next) {
    const str = req.params.today.split('-');
    const year = Number(str[0]);
    const month = Number(str[1]) - 1;
    const date = Number(str[2]);

    var today =  new Date(year, month, date);

    var start = moment(today).format('YYYY-MM-DD');
    var tomorrow = moment(moment(today).add(1, 'days')).format('YYYY-MM-DD');

    // Invoice.find({in_date:{$gte: start, $lt: tomorrow}}).populate('unstoring').sort({invoice:1}).exec(function(err,invoices) {
    //     res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    // });

    // 입력한 날 이후 모든 데이터를 보여주도록 한다.  20181009
    Invoice.find({in_date:{$gte: start}}).populate('unstoring').sort({invoice:1}).exec(function(err,invoices) {
        res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    });
});

router.get('/:today/sale', function(req,res,next) {
    const str = req.params.today.split('-');
    const year = Number(str[0]);
    const month = Number(str[1]) - 1;
    const date = Number(str[2]);

    var today =  new Date(year, month, date);

    var start = moment(today).format('YYYY-MM-DD');
    var tomorrow = moment(moment(today).add(1, 'days')).format('YYYY-MM-DD');

    // Invoice.find({in_date:{$gte: start, $lt: tomorrow}}).populate('unstoring').sort({invoice:1}).exec(function(err,invoices) {
    //     res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    // });
    // 입력한 날 이후 모든 데이터를 보여주도록 한다.  20181009
    Invoice.find().populate({
        path:'unstoring',
        match: { 
            outDate: {$gte: start}
        }}).sort({invoice:1}).exec(function(err,invoices) {
        res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    });
});

router.get('/getlist/:seller_no', function(req,res,next) {
    const seller_no = req.params.seller_no;
    //console.log(req.params.seller_no);
    Invoice.find({$and: [ {seller_no: seller_no}, { $where: function() { return (this.in_number !== this.out_number);}}]})
        .sort({invoice:1}).exec(function(err,invoices) {
            res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    });
});

router.get('/getlist/:seller_no/all', function(req,res,next) {
    const seller_no = req.params.seller_no;
    //console.log(req.params.seller_no);
    Invoice.find({seller_no: seller_no}).sort({invoice:1}).exec(function(err,invoices) {
        //console.log(invoices);
        res.json( err || !invoices ? util.successFalse(err) : util.successTrue(invoices));
    });
});

router.get('/getitem/:id', function(req,res,next) {
    Invoice.findOne({_id: req.params.id}).populate('unstoring').exec(function(err,invoice) {
        //console.log(err);
        if(err) {
            // 출고데이터가 없는 경우
            Invoice.findOne({_id: req.params.id}).exec(function(err,invoice) {
                //console.log(invoice);
                if(err) {
                    res.json(util.successFalse(err));
                } else {
                    res.json(util.successTrue(invoice));
                }
            });
        } else {
            res.json(util.successTrue(invoice));
        }
        //res.json( err || !invoice ? util.successFalse(err) : util.successTrue(invoice));
    });
});

// update
router.put('/:id', util.isLoggedin, function(req,res,next){
    Invoice.findOne({_id: req.params.id}).exec(function(err, invoice){
        if( err || !invoice ) 
            return res.json(util.successFalse(err));

        for(var p in req.body) {
            invoice[p] = req.body[p];
        }
        
        // save updated user
        invoice.save(function(err,invoice) {
            if( err || !invoice ) return res.json(util.successFalse(err));
            else {
                res.json(util.successTrue(invoice));
            }
        });
    });
});

// destroy
router.delete('/:id', util.isLoggedin, function(req,res,next){
    Invoice.findOneAndRemove({_id:req.params.id}).exec(function(err,invoice) {
        if( err || !invoice)
            res.json(util.successFalse(err));
        else {
            // Unstoring 삭제
            //console.log(invoice.unstoring);
            Unstoring.deleteMany({ _id : {$in : [invoice.unstoring] }} ).exec(function(err, unstoring) {
                res.json(util.successTrue(invoice));                
            });           
        }        
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