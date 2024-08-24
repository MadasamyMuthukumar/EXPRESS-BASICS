const http = require('http');
const express = require('express')
const bp = require('body-parser')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const rootDir = require('./utils/path');
const path= require('path')
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
//CUSTOM MIDDLEWARE
const customMiddleware =(req,res,next)=>{
    console.log("Custom MIddleware logged");
    next(); //making next call to go to ohter middlewares    
}
const app = express();
app.use(express.static(path.join(__dirname,'public'))) // static file shoudl be first
app.use(bp.urlencoded());  //applying middleware
app.use(customMiddleware);

//CUSTOM MIDDLEWARE TO ADD THE CREATED TIME TO THE REQUEST with own property name requestedAt
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

app.use('/en',adminRoutes) //applying our admin routes to express with prefix of /en
app.use(shopRoutes)

//404 page response
app.use((req,res,next)=>{
    res.status(404).send('<h4>404 PAGE NOT FOUND</h4>')
})
console.log(process.env);


app.listen(process.env.PORT || 3005); //port