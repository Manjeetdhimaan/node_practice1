const express = require('express');
const app = express();
// aoP99vZm1uNYPSXM
const mongoose = require('mongoose');

const User = require('./models/users')
//
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//
const crypto = require('crypto');
const key = 'password';
const algo = 'aes-128-ecm'

//
const jwt = require('jsonwebtoken');
const jwtKey = 'jwt'

mongoose.connect('mongodb+srv://mani:aoP99vZm1uNYPSXM@cluster0.14vpn.mongodb.net/nodeJs?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected with db')
})

// user sign up API
app.post('/register', jsonParser, function (req, res) {

    //password encryption getting issues cuz of some changes in crypto package,  therefore commented

    // 
    // let iv = crypto.randomBytes(32)
    // let cipher = crypto.createCipheriv(algo, key, iv);
    // let encrypted = cipher.update(req.body.password, 'utf-8', 'hex')
    // +cipher.final('hex')
    // console.log(req.body.encrypted)

    const data = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password //it wiil "encryted" (variable encrypted : line no. 33) instead of "req.body.password"
    })
    data.save().then((result) => {
        jwt.sign({ result }, jwtKey, { expiresIn: '3000s' }, (err, token) => {
            res.status(201).json({ token })
        })
        // res.json(result)
    }).catch((err) => console.log(err))
})

// user login API

app.post('/login', jsonParser, function (req, res) {
    User.findOne({ email: req.body.email }).then((data) => {
        //password decryption getting issues cuz of some changes in crypto package,  therefore commented

        // let iv = crypto.randomBytes(32)
        // let decipher =crypto.createDecipheriv(algo, key, iv)
        // let decrpyted = decipher.update(data.password, 'hex', 'utf8')
        // +decipher.final('utf8')

        if (req.body.password == req.body.password) {  // one value wiil "decrpyted" (variable decrpyted : line no. 58) instead of "req.body.password"
            jwt.sign({ data }, jwtKey, { expiresIn: '3000s' }, (err, token) => {
                res.status(201).json({ token })
            })
        }


    })
})

// get users API
app.get('/users', verifyToken, (req, res) => {
    User.find().then((result) => {
        res.status(200).json(result)
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    // console.log(bearerHeader);
    if (typeof (bearerHeader) !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        // console.log(bearer[1]);
        req.token = bearer[1];
        jwt.verify(req.token, jwtKey, (err, authData) => {
            if (err) {
                res.json({ result: err });
            }
            else {
                next();
            }
        })
    }
    else {
        res.send({ "result": "Token not provided" })
    }
}



app.get('/', function (req, res) {
    res.end('Hello')
})
app.listen(4000, function () {
    console.log('Listening on port:4000')
})