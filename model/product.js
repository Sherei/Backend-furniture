    let mongoose = require("mongoose");

    let productSchema = mongoose.Schema({
        
        images: [String],
        title:String,

        description:String,
        description2:String,
        description3:String,
        description4:String,
        featureHead:String,
        feature1:String,
        feature2:String,
        feature3:String,
        feature4:String,
        feature5:String,
        feature6:String,
        feature7:String,
        note1:String,
        note2:String,
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
