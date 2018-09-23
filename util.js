var jwt = require('jsonwebtoken');

var util = {};

util.successTrue = function(data) {
    return {
        success:true,
        message:null,
        errors:null,
        data:data
    };
};

util.successFalse = function(err, message) { 
    if( !err && !message ) 
        message = 'data not found';
    return {
        success:false,
        message:message,
        errors: (err) ? util.parseError(err) : null,
        data:null
    };
};

util.parseError = function(errors) {
    var parsed = {};
    if(errors.name == 'ValidationError') {
        for(var name in errors.errors) {
            var validationError = errors.errors[name];
            parsed[name] = { message:validationError.message };
        }
    } else if(errors.code == '11000' && errors.errmsg.indexOf('userID') > 0) {
        parsed.userID = { message:'이미 등록된 아이디 입니다.' };
    } else {
        parsed.unhandled = errors;
    }
    return parsed;
};


// middlewares
util.isLoggedin = function(req,res,next) { 
    var token = req.headers['x-access-token'];
    if ( !token ) 
        return res.json(util.successFalse(null,'token is required!'));
    else {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if(err) return res.json(util.successFalse(err));
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
};

module.exports = util;