const mongoose = require('mongoose');

const user = {
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    regDate : {
        type: Date,
        default: Date.now
    },
    verif : {
        type : String,
        required : true
    },
    verified : {
        type : Boolean,
        default : false
    }
}


const userSchema = new mongoose.Schema(user);


module.exports = {
    UserModel : mongoose.model('User',userSchema)
}