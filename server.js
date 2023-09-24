const myExpress = require('express');

const app = myExpress();

app.use(myExpress.json())

const cors = require('cors')

require('dotenv').config();

const fileUpload = require('express-fileupload')
app.use(fileUpload({
    useTempFiles: true
}))

const cloudinary = require('cloudinary').v2;

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

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

const SignupUsers = require('./model/user')

const Product = require('./model/product')

const Comment = require('./model/comments')

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

        if (req.body.password === req.body.cpassword) {

            // req.body.password = await bcrypt.hash(req.body.password, 10);

            // req.body.cpassword = await bcrypt.hash(req.body.cpassword, 10);

            const newUser = new SignupUsers(req.body);

            await newUser.save();

            res.send("User Created");

        } else {
            res.send("Passwords do not match");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/login', async (req, res) => {

    try {

        const user = await SignupUsers.findOne({ email: req.body.email, password: req.body.password })

        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        else if (user) {
            token.sign({ tokenId: user._id }, "My user", { expiresIn: "1y" }, async (err, myToken) => {
                res.json({ user, myToken });
            });
        }
        else {
            res.status(404).json({ message: "Invalid credentials" })
        }

    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
})

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
        res.json({ Users, Products, comments })
    } catch (e) {
        res.send(e)
    }
})

