const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const port=process.env.PORT || 9000;
const dotenv=require('dotenv').config();
const path = require('path')

const faceRouter=require('./routes/routes');



mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology: true})

const db=mongoose.connection
db.on('error',(error)=> console.log(error));
db.once('open',()=>console.log("Connected to database"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public',express.static(path.join(__dirname,'static')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/',faceRouter)


app.listen(port, ()=>{
    console.log(`listening at port ${port}`)
})
