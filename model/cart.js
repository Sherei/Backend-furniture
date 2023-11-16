const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    title: String,
    image: String,
    productId: String,
    userId: String,
    size:String,
    color:String,
    fabric:String,
    detail:String,
    base:String,
    headboard:String,
    ottoman:String,
    total:Number,
    mattress:String,
    quantity: Number,
    price: Number,
    Fprice: Number,
    sn: Number,
    category: String,
    subCategory: String,
    discount: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
    