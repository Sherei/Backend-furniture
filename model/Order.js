const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    title: String,
    sn: String,
    category: String,
    image: String,
    subCategory: String,
    price: String,
    total:Number,
    quantity: String,
    discount: Number,
    size:String,
    color:String,
    fabric:String,
    detail:String,
    base:String,
    headboard:String,
    ottoman:String,
    mattress:String,

});

const orderSchema = new mongoose.Schema({
    orderId: String,
    total:Number,
    userId: String,
    orderItems: [orderItemSchema],
    name1: String,
    name2: String,
    email: String,
    country:String,
    city:String,
    street:String,
    appartment:String,
    postal:String,
    note:String,
    number1: {
        type:Number,
        trim:true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
