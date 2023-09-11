let myExpress = require('express');

let cors = require('cors')

let app = myExpress();
const cloudinary = require('cloudinary').v2;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


app.use(myExpress.json())

cloudinary.config({
    cloud_name: 'drouq9iz2',
    api_key: '174878427379428',
    api_secret: 'D9clvP6G0U5RpfmQRNViGNEddHY',
});

app.listen(3010, function () {
    console.log("server chla pra")
})

require("./model/db")

let SignupUsers = require('./model/user')

let Product = require('./model/product')

let Comment = require('./model/comments')

let token = require('jsonwebtoken');


app.post('/product', async (req, res) => {
    try {
        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url;
            })
        );

        req.body.images = imageUrls;

        let existingProduct = await Product.findOne({ sn: req.body.sn });

        if (existingProduct) {
            return res.status(400).send('Try with a different Serial Number');
        } else {
            let newProduct = new Product(req.body);
            await newProduct.save();
            res.send('Product Added');
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/product', async (req, res) => {

    try {

        let newProduct = await Product.find().sort({ _id: -1 })
        res.json(newProduct)

    } catch (e) {
        console.log(e)

    }
})

app.get('/singleProduct', async (req, res) => {

    try {

        let singleProduct = await Product.findById(req.query.id)
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




app.post('/session-check', async (req, res) => {

    token.verify(req.body.token, "My user", async function (err, dataObj) {
        if (dataObj) {
            let user = await SignupUsers.findById(dataObj.tokenId)
            res.json(user)
        }
    })

})


app.post('/signUp', async (req, res) => {
    try {
        let existingUser = await SignupUsers.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("User with this email already exists");
        }

        let password = req.body.password;
        let cpassword = req.body.cpassword;

        if (password === cpassword) {
            let newUser = new SignupUsers(req.body);
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
        let user = await SignupUsers.findOne({ email: req.body.email, password: req.body.password })
        if (user) {
            token.sign({ tokenId: user._id }, "My user", { expiresIn: "1y" }, async (err, myToken) => {
                res.json({ user, myToken })
            })
        } else {
            res.status(404).json({ message: "Invalid credentials" })

        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
})

app.get('/Users', async (req, res) => {

    try {

        let newUser = await SignupUsers.find().sort({ _id: -1 })
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

