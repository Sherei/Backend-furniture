const myExpress = require('express');

const app = myExpress();

app.use(myExpress.json())

const cors = require('cors')

require('dotenv').config();

const fileUpload = require('express-fileupload')
app.use(fileUpload({
    useTempFiles: true,
}))

const cloudinary = require('cloudinary').v2;

const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
};

app.use(cors());


cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET,

});

const port = process.env.PORT || 3010;

app.listen(port, function () {
    console.log(`Server is running on port ${port}`)
})

require("./model/db")

const bcrypt = require('bcrypt');

const SignupUsers = require('./model/user')

const Product = require('./model/product')

const Comment = require('./model/comments')

const Cart = require('./model/cart')

const Orders = require('./model/Order')

const token = require('jsonwebtoken');



app.post('/product', async (req, res) => {
    try {

        const cloudinaryUrls = [];

        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

        for (const file of images) {
            try {
                const result = await cloudinary.uploader.upload(file.tempFilePath);
                cloudinaryUrls.push(result.secure_url);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        const existingProduct = await Product.findOne({ sn: req.body.sn });

        if (existingProduct) {
            return res.status(400).send('Try with a different Serial Number');
        }

        const newProduct = new Product({
            ...req.body,
            images: cloudinaryUrls,
        });

        await newProduct.save();
        res.send({ message: 'Product Added' });

    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/session-check', async (req, res) => {

    token.verify(req.body.token, "My user", async function (err, dataObj) {
        if (dataObj) {
            const user = await SignupUsers.findById(dataObj.tokenId)
            res.json(user)
        }
    })

})


app.post('/signUp', async (req, res) => {
    try {
        const existingUser = await SignupUsers.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).send("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const hashedCPassword = await bcrypt.hash(req.body.cpassword, 10);

        const newUser = new SignupUsers({
            ...req.body,
            password: hashedPassword,
            cpassword: hashedCPassword,
        });

        await newUser.save();

        res.send("User Created");

    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
});




app.post('/login', async (req, res) => {
    try {
        const user = await SignupUsers.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (isPasswordValid) {
            token.sign({ tokenId: user._id }, "My user", { expiresIn: "1y" }, async (err, myToken) => {
                res.json({ user, myToken });
            });
        } else {
            res.status(404).send("Invalid Credentials");
        }

    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
});


app.get('/Users', async (req, res) => {

    try {

        const newUser = await SignupUsers.find().sort({ _id: -1 })
        res.json(newUser)

    } catch (e) {
        console.log(e)

    }
})

app.delete('/deleteUser', async function (req, res) {

    try {

        await SignupUsers.findByIdAndDelete(req.query.id)

        res.end("Delete ho gya")

    } catch (e) {
        res.send(e)
    }

})


app.get('/product', async (req, res) => {

    try {
        const newProduct = await Product.find().sort({ _id: -1 })
        res.json(newProduct)
    } catch (e) {
        console.log(e)

    }
})



app.get('/singleProduct', async (req, res) => {

    try {

        const singleProduct = await Product.findById(req.query.id)
        res.json(singleProduct)

    } catch (e) {
        res.end(e)
    }
})


app.delete('/deleteProduct', async function (req, res) {

    try {

        await Product.findByIdAndDelete(req.query.id)

        fs.rmSync('./server/pics/', { recursive: true, force: true })

        res.end("Delete ho gya")
    } catch (e) {
        res.send(e)
    }

})


app.post("/addToCart", async function (req, res) {

    try {

        const existingProduct = await Cart.findOne({ productId: req.body.productId, userId: req.body.userId });

        if (existingProduct) {

            return res.status(400).send("Product is already into Cart");
        }

        const newCart = new Cart(req.body);

        await newCart.save();

        res.send("Product Added");

    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
})

app.get("/addToCart", async function (req, res) {

    try {
        const newCart = await Cart.find().sort({ _id: -1 })
        res.json(newCart)
    } catch (e) {
        console.log(e)
    }
})

app.put("/updateCart", async function (req, res) {
    try {
        const updatedCartData = req.body;
        for (const item of updatedCartData) {
            await Cart.updateOne(
                { _id: item._id },
                {
                    quantity: item.quantity,
                    Fprice: item.Fprice,
                }
            );
        }
        res.send("Cart updated successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

app.delete('/deleteCart', async function (req, res) {

    try {

        await Cart.findByIdAndDelete(req.query.id)
        res.end("Delete ho gya")

    } catch (e) {
        res.send(e)
    }

})


app.post('/Order', async (req, res) => {

    try {

        const orderItems = JSON.parse(req.body.orderItems);

        const newOrder = new Orders({
            name1: req.body.name1,
            name2: req.body.name2,
            userId: req.body.userId,
            orderId: req.body.orderId,
            number1: req.body.number1,
            number2: req.body.number2,
            orderItems: orderItems,
            email: req.body.email,
            shipping: req.body.shipping,
            payment: req.body.payment,
        });

        await newOrder.save();

        res.send('Order is Placed');

        await Cart.deleteMany({ userId: req.body.userId });


    } catch (e) {
        console.error(e);
        res.status(500).send('Error placing the order');
    }
});


app.get('/order', async (req, res) => {
    try {

        const newOrder = await Orders.find().sort({ _id: -1 });
        res.json(newOrder);

    } catch (e) {
        console.log(e);
        res.status(500).send('Error fetching orders');
    }
});


app.get('/orderDetail', async (req, res) => {

    try {

        const singleOrder = await Orders.findById(req.query.id)
        res.json(singleOrder)

    } catch (e) {
        res.end(e)
    }
})

app.put('/updateStatus', async (req, res) => {
    try {
        const orderId = req.body.id;
        const newStatus = req.body.status;

        const updatedOrder = await Orders.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }

        res.json(updatedOrder);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error updating order status');
    }
});

app.delete('/deleteOrder', async function (req, res) {

    try {

        await Orders.findByIdAndDelete(req.query.id)

        res.end("Delete ho gya")

    } catch (e) {
        res.send(e)
    }

})

app.post('/comments', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.send("Comment Added");
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/comments', async (req, res) => {
    try {

        const comments = await Comment.find().sort({ _id: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/deleteComment', async function (req, res) {

    try {

        await Comment.findByIdAndDelete(req.query.id)

        res.end("Delete ho gya")

    } catch (e) {
        res.send(e)
    }


})


app.get("/dashboard", async function (req, res) {
    try {
        const Users = await SignupUsers.find()
        const Products = await Product.find()
        const comments = await Comment.find()
        const allOrder = await Orders.find()

        res.json({ Users, Products, comments, allOrder })

    } catch (e) {
        res.send(e)
    }
})

