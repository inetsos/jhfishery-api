var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// schema
var sellerSchema = mongoose.Schema({
    userID: {
        type: String,
        required: [true, '아이디를 입력하세요.'],
        match: [/^.{8,16}$/,'8~16사이의 영문 숫자입니다 .'],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,'비밀번호를 입력하세요.'],
        match: [/^.{8,16}$/,'8~16 사이의 숫자와 영문자의 조합입니다.'],
        select:false
    },
    sellerNo: {
        type: Number,
        required:[true,'영업인 번호를 입력하세요.'],
        match: [/^[0-9]*$/,'숫자만 입력하세요.'],
    },
    name:{
        type:String,
        trim:true
    },
    storeName:{
        type:String,
        required:[true,'상호를 입력하세요.'],
        match:[/^.{2,40}$/,'2~40글자입니다.'],
        trim:true
    },
    phone:{
        type:String,
        required:[true,'전화번호를 입력하세요.'],
        match:[/^\d{2,3}-\d{3,4}-\d{4}$/,'전화번호('-'포함)를 입력하세요.'],
        trim:true
    },
    email:{
        type:String,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'메일주소를 입력하세요.'],
        trim:true
    }
},{
    toObject:{ virtuals:true }
});

// virtuals
sellerSchema.virtual('confirmPassword')
    .get(function(){ return this._confirmPassword; })
    .set(function(value){ this._confirmPassword=value; });

sellerSchema.virtual('originalPassword')
    .get(function(){ return this._originalPassword; })
    .set(function(value){ this._originalPassword=value; });

sellerSchema.virtual('currentPassword')
    .get(function(){ return this._currentPassword; })
    .set(function(value){ this._currentPassword=value; });

sellerSchema.virtual('newPassword')
    .get(function(){ return this._newPassword; })
    .set(function(value){ this._newPassword=value; });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = '8~16자 사이의 숫자와 영문자의 조합입니다.';
sellerSchema.path('password').validate(function(v) {
    var user = this;

    // create user
    if(user.isNew){
        if(!user.confirmPassword) {
            user.invalidate('confirmPassword', '비밀번호 확인이 필요합니다.');
        }

        if (!passwordRegex.test(user.password)) {
            user.invalidate('password', passwordRegexErrorMessage);
        } else if(user.password !== user.confirmPassword) {
            user.invalidate('confirmPassword', '비밀번호와 확인이 일치하지 않습니다.');
        }
    }

    // update user
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPassword', '비밀번호를 입력하세요.');
        }

        if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){
            user.invalidate('currentPassword', '비밀번호가 일치하지 않습니다.');
        }

        if(user.newPassword && !passwordRegex.test(user.newPassword)){
            user.invalidate('newPassword', passwordRegexErrorMessage);
        } else if(user.newPassword !== user.confirmPassword) {
            user.invalidate('confirmPassword', '비밀번호 확인이 일치하지 않습니다.');
        }
    }
});

// hash password
sellerSchema.pre('save', function (next){
    var user = this;
    if(!user.isModified('password')){
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

// model methods
sellerSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
};

// model & export
var Seller = mongoose.model('seller',sellerSchema);
module.exports = Seller;