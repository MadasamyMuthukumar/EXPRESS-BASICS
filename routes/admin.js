const express = require('express')
const path = require('path')
const roootDir = require('../utils/path')

const router = express.Router();
router.get('/add-product',(req,res,next)=>{  //first parameter will be path
    console.log("First middleware");
    res.sendFile(path.join(roootDir,'views','add.html'))

    
})
//only execute for post request (cant access using get request)
router.post('/store-data',(req,res,next)=>{  //first parameter will be path
    console.log("Second middleware");
    console.log(req.body); 
    res.send('<h3>Product Received</h3>')
})

module.exports = router //exporting router