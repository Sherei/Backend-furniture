let mongoose = require('mongoose');

try {
    let connect = mongoose.connect("mongodb+srv://sharjeel:Sharjeel3322@cluster0.zvd5ct1.mongodb.net/")
    console.log(connect)
} catch (e) {
    console.log(e)
}