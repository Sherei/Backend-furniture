const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    title: String,
    image: String,
    productId: String,
    userId: String,
    size:String,
    color:String,
    pillow:String,
    detail:String,
    base:String,
    fabric:String,
    headboard:String,
    ottoman:String,
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
    