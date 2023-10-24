let mongoose = require("mongoose");

let cartSchema = mongoose.Schema({
    title:String,
    image: String,
    productId:String,
    userId:String,
    size:String,
    quantity:Number,
    price:Number,
    Fprice:Number,
    sn:Number,
    category:String,
    subCategory:String,
    discount:Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

let Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
