let mongoose= require("mongoose");

let userSchema= mongoose.Schema({
    name: String,
    password:String,
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