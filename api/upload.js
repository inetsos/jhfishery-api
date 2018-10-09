var express  = require('express');
var router   = express.Router();

var Invoice     = require('../models/Invoice');
var util     = require('../util');
const fs = require('fs');
var path       = require('path');
const multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

const DIR = './uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + util.getDateTimeStr() + path.extname(file.originalname));
    }
});
let upload = multer({
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('잘못된 확장자입니다.'));
        }
        callback(null, true);
    }
}).single('excel');

router.post('/',  function(req, res) {
    var exceltojson; //Initialization
    upload(req, res, function(err) {
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"파일이 없습니다."});
            return;
        }

        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }

        try {
            exceltojson({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                } 
                // 업로드 데이터를 저장하자.                
                for(var i=0; i<result.length; i++) {
                    var invoice = new Invoice();

                    invoice.trader = result[i].trader;
                    invoice.in_out = "입고";
                    invoice.in_date = result[i].in_date;
                    invoice.seller = result[i].seller;
                    invoice.deal_type = result[i].deal_type;
                    invoice.invoice = result[i].invoice;
                    invoice.origin = result[i].origin;
                    invoice.item = result[i].item;
                    invoice.unit = parseInt(result[i].unit);
                    invoice.quality = result[i].quality;
                    invoice.weight = result[i].weight;
                    invoice.in_number = parseInt(result[i].in_number);
                    invoice.in_sum = parseInt(result[i].in_sum);
                    invoice.seller_no = parseInt(result[i].seller_no);
                    invoice.out_date = '';
                    invoice.out_number = 0;
                    invoice.out_sum = 0;
                    invoice.out_purchase = '';
                    invoice.save()
                        .then((invoice) => {
                            //console.log(invoice);
                            //res.json({error_code:0,err_desc:null, data: result});
                        })
                        .catch((err) => {
                            //console.log(err);
                            //return res.json({error_code:1,err_desc:err});
                        });
                }
                res.json({error_code:0,err_desc:null, data: result});
            });
        } catch (e){
            res.json({error_code:1,err_desc:"엑셀 파일이 아닙니다."});
        }
    });
});   

module.exports = router;