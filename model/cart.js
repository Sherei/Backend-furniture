const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    title: String,
    image: String,
    productId: String,
    userId: String,
    size: String,      // Include size field
    mattress: String,  // Include mattress field
    color: String,     // Include color field
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
    