let mongoose= require("mongoose");

let userSchema= mongoose.Schema({
    name: String,
    address:String,
    password:String,
    cpassword:String,   
    number:Number,
    email: {
        type:String,
        unique:true,
    },
   
    date:{
        type:Date,
        default:Date.now,
    },
})

let Users= mongoose.model('user', userSchema);

module.exports= Users;