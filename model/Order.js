const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    title: String,
    sn: String,
    category: String,
    subCategory: String,
    size:String,
    color:String,
    fabric:String,
    detail:String,
    base:String,
    headboard:String,
    ottoman:String,
    mattress:String,
    image: String,
    price: String,
    quantity: String,
    discount: Number,
    Fprice: String,
});

const orderSchema = new mongoose.Schema({
    name1: String,
    name2: String,
    shipping: String,
    userId: String,
    orderId: String,
    country:String,
    city:String,
    total:Number,
    postal:String,

    orderItems: [orderItemSchema],
    number1: {
        type:Number,
        trim:true
    },
    email: String,
    payment: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
