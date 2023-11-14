const myExpress = require('express');

const app = myExpress();
const cors = require('cors')

require('dotenv').config();
app.use(myExpress.json());
app.use(cors());

app.use(myExpress.json())

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

        const existingProduct = await Product.findOne({ sn: req.body.sn });

        if (existingProduct) {
            return res.status(400).send('Try with a different Serial Number');
        }

        const newProduct = new Product(req.body);

        await newProduct.save();

        res.send({ message: 'Product Added' });

    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }

});


app.get("/product_edit", async function (req, res) {

    try {

        let product = await Product.findById(req.query.id);
        res.json(product);

    } catch (e) {

        res.status(500).json(e);
    }
})

app.put('/product-update', async function (req, res) {
    try {
        const productId = req.body._id;

        // Fetch the existing product
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (req.body.images && (req.body.images.length < 1 || req.body.images.length > 5)) {
            return res.status(400).json({ message: 'Invalid number of images. Must be between 1 and 5.' });
        } else {
            existingProduct.images = req.body.images;
        }
        
        existingProduct.title = req.body.title || existingProduct.title;
        existingProduct.sn = req.body.sn || existingProduct.sn;
        existingProduct.category = req.body.category || existingProduct.category;
        existingProduct.subCategory = req.body.subCategory;
        existingProduct.descriptionHead1 = req.body.descriptionHead1;
        existingProduct.description = req.body.description;
        existingProduct.descriptionHead2 = req.body.descriptionHead2;
        existingProduct.description2 = req.body.description2;
        existingProduct.descriptionHead3 = req.body.descriptionHead3;
        existingProduct.description3 = req.body.description3;
        existingProduct.descriptionHead4 = req.body.descriptionHead4;
        existingProduct.description4 = req.body.description4;
        existingProduct.featureHead = req.body.featureHead;
        existingProduct.feature1 = req.body.feature1;
        existingProduct.feature2 = req.body.feature2;
        existingProduct.feature3 = req.body.feature3;
        existingProduct.feature4 = req.body.feature4;
        existingProduct.feature5 = req.body.feature5;
        existingProduct.feature6 = req.body.feature6;
        existingProduct.feature7 = req.body.feature7;
        existingProduct.dimensionHead = req.body.dimensionHead;
        existingProduct.dimension1 = req.body.dimension1;
        existingProduct.dimension2 = req.body.dimension2;
        existingProduct.dimension3 = req.body.dimension3;
        existingProduct.dimension4 = req.body.dimension4;
        existingProduct.note1 = req.body.note1;
        existingProduct.note2 = req.body.note2;
        existingProduct.price = req.body.price || existingProduct.price;
        existingProduct.discount = req.body.discount || existingProduct.discount;
        existingProduct.Fprice = req.body.Fprice || existingProduct.Fprice;

        await existingProduct.save();

        res.json({ message: 'Product Updated' });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
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
        console.log(req.body)
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

