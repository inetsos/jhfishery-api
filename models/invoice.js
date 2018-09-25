// 시장도매인명	trader	string
// 반입일자	in_date	string
// 출하자(매도인)	seller	string
// 거래형태	deal_type	string
// 송장번호	invoice	string
// 원산지	origin	string
// 품종	    item	string
// 거래단량	unit	number
// 등급	quality	string
// 반입중량	weight	number
// 수량	in_number	number
// 매수금액	in_sum	number
// 매출일	out_date	string
// 출고수량	out_number	number
// 판매금액	out_sum	number
// 매수처	out_purchase	string    

var mongoose = require('mongoose');

// schema
var invoiceSchema = mongoose.Schema({
    trader: { type: String, trim:true, },
    in_out: { type: String, trim:true, },   // 입고/출고
    in_date: { type: String, trim:true, },
    seller: { type: String, trim:true, },
    deal_type: { type: String, trim:true, },
    invoice: { type: String, trim:true, },
    origin: { type: String, trim:true, },
    item: { type: String, trim:true, },
    unit: { type: Number },
    quality: { type: String, trim:true, },
    weight: { type: Number },
    in_number: { type: Number },
    in_sum: { type: Number },
    out_date: { type: String, trim:true, },
    out_number: { type: Number },
    out_sum: { type: Number },
    out_purchase: { type: String, trim:true, }
});

// model & export
var Invoice = mongoose.model('invoice',invoiceSchema);
module.exports = Invoice;