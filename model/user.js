let mongoose= require("mongoose");

let userSchema= mongoose.Schema({
    name: String,
    email: {
        type:String,
        unique:true,
    },
    password:String,
    cpassword:String,
   
    number:Number,
    date:{
        type:Date,
        default:Date.now,
    },
})

let Users= mongoose.model('user', userSchema);

module.exports= Users;