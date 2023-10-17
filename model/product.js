let mongoose = require("mongoose");

let productSchema = mongoose.Schema({
    trending:String,
    feature:String,
    images: [String],
    title:String,
    description:String,
    category: String,
    subCategory:String,
    sn: {
        type: Number,
        trim: true,
        unique:true,
    },
    discount: {
        type: Number,
        trim: true,
    },
    price: {
        type: Number,
        trim: true,
    },
    Fprice: {
        type: Number,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

let Product = mongoose.model('product', productSchema);

module.exports = Product;
