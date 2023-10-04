let mongoose= require("mongoose");

let userSchema= mongoose.Schema({
    name: String,
    address:String,
    password:String,
    cpassword:String,   
    number:{
        type:Number,
        trim:true
    },
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