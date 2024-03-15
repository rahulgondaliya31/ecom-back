const express = require("express");
const bodyParser = require("body-parser");
const file = require("./app/routes/file");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const User = require("./app/models/user.js")
var jwt = require('jsonwebtoken');

global.nodeSiteUrl = 'http://192.168.1.121:4000/';

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept'); 
    next();
});

app.set('view engine','ejs'); 

app.engine('ejs', require('ejs').__express);;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send("Welcome to Kabooter application")  
})

require("./app/routes/product.js")(app);
require("./app/routes/user.js")(app);

app.use("/file",file)

app.get('/setnewpassword/:id', function(req, res) {
    var id = req.params.id;
    var decoded = jwt.verify(id,'shhhhh');
    User.findUserInfo(decoded.foo,(err,info)=>{
        res.render("changePassword", { id: info.id , is_reset : info.is_password_reset });
    })
});

const PORT = 4000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})