require('dotenv').config();
const express = require('express');
var app = express();

app.use(express.text());
app.use(express.urlencoded({extended:false}));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

// var auth = require('./model/v1/auth/route');
var product = require('./model/v1/product/route');

app.use('/', require('./middleware/validation').extractheaderlanguage)
app.use('/',require('./middleware/validation').validateApiKey);
app.use('/',require('./middleware/validation').validateUserToken);

app.use('/api/v1/auth',auth);
app.use('/api/v1/product',product);

try{
    app.listen(process.env.PORT);
    console.log('app listing on port : 8190');
}catch{
    console.log('connection fails');
}