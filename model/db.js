let mongoose = require('mongoose');

try {
    let connect = mongoose.connect(process.env.MONGODB_URI);
    console.log(connect)
} catch (e) {
    console.log(e)
}