
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    tgId : {
        type : String,
        required : true,
        Unique : true
    },

    firstName: {
        type : String,
        required : true,

    },
    lastName: {
        type : String,
        required : true,
        
    },
    isBot: {
        type : Boolean,
        required : true,
        
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    promptTokens : {
        type : Number,
        required : false,

    },
    completionTokens : {
        type : Number,
        required : false
    }
} , {timestamps : true})

module.exports =  mongoose.model('User' , UserSchema)