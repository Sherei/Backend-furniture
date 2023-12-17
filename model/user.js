let mongoose= require("mongoose");

let userSchema= mongoose.Schema({
    name: String,
    username:String,
    birthdate:date,
    password:String,
    cpassword:String,   
    email: {
        type:String,
        unique:true,
        trim:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})

let Users= mongoose.model('user', userSchema);

module.exports= Users;