const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    title: String,
    sn: String,
    category: String,
    subCategory: String,
    size:String,
    color:String,
    mattress:String,
    detail:String,
    base:String,
    fabric:String,
    headboard:String,
    ottoman:String,
    image: String,
    price: String,
    quantity: String,
    discount: Number,
    Fprice: String,
});

const orderSchema = new mongoose.Schema({
    name1: String,
    name2: String,
    userId: String,
    orderId: String,
    orderItems: [orderItemSchema],
    number1: {
        type:Number,
        trim:true
    },
    number2: {
        type:Number,
        trim:true
    },
    status: String,
    email: String,
    shipping: String,
    payment: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
