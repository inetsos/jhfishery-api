var mongoose = require('mongoose');

// schema
var unstoringSchema = mongoose.Schema({
    outDate: {
        type: String,
        required: [true, '판매일을 입력하세요.'],
        trim:true
    },
    outNumber:{
        type:Number,
        required:[true,'판매수량을 입력하세요.'],
        match: [/^[0-9]*$/,'숫자만 입력하세요.'],
    },
    outPrice:{
        type:Number,
        required:[true,'판매수량을 입력하세요.'],
        match: [/^[0-9]*$/,'숫자만 입력하세요.'],
    },
    outSum:{
        type:Number
    },
    outPurchase:{
        type:String,
        required:[true,'판매처를 입력하세요.'],
        match:[/^.{2,40}$/,'2~40글자입니다.'],
        trim:true
    }
});

// model & export
var Unstoring = mongoose.model('unstoring',unstoringSchema);
module.exports = Unstoring;