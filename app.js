const express = require('express');
const app = express();
// aoP99vZm1uNYPSXM
const mongoose = require('mongoose');
const User = require('./models/users')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const crypto = require('crypto');
const key = 'password';
const algo = 'aes-128-ecm'
mongoose.connect('mongodb+srv://mani:aoP99vZm1uNYPSXM@cluster0.14vpn.mongodb.net/nodeJs?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected with db')
})
app.post('/register',jsonParser,  function (req, res) {
    let iv = crypto.randomBytes(32)
    let cipher = crypto.createCipher(algo, key, iv);
    let encrypted = cipher.update(req.body.password, 'utf-8', 'hex')
    +cipher.final('hex')
    console.log(req.body.encrypted)
    res.end('Hello')
})

app.get('/', function (req, res) {
    res.end('Hello')
})
app.listen(4000, function () {
    console.log('Listening on port:4000')
})