let mongoose = require("mongoose");

let productSchema = mongoose.Schema({
    trending:String,
    feature:String,
    images: [String],
    discount: {
        type: Number,
        trim: true,
    },
    title: {
        type: String,
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
    description: {
        type: String,
        trim: true,
    },
    sn: {
        type: Number,
        trim: true,
        unique: true,
    },
    category: {
        type: String,
        trim: true,
    },
    subCategory: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

let Product = mongoose.model('product', productSchema);

module.exports = Product;
