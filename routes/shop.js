const express = require('express')
const path = require('path')
const roootDir = require('../utils/path')
const fs=require('fs')
const app = express();
const router = express.Router();
const list = JSON.parse(fs.readFileSync('./data/data.json'));

app.use(express.json()) //middleware to acces req.bodyy

//CUSTOM PARAM MIDDLEWARE
/**
 * value will be the prameter value
 * instead of writing repeated code. we can use middleware
 * 
 */
const checkId =(req,res,next,value)=>{
    console.log("Check middleware ",value);

    const movie = list.find((ele)=> ele.id ===value * 1);
    if(!movie){
        return res.status(404).json({
            status:"failed",
            message: `Movie with ID ${value} is not found`
        })
       }

    next();
}
//CUSTOM MIDDLEWARE TO VALIDATE BODY WHILE CREATING OBJECT

const validateBody=(req,res,next)=>{
    //if the requested data without name or year then we dont add it to the list
    if(!(req.body.name || req.body.releasedYear)){
        return res.status(400).json({
            status:"fails",
            message:"Invalid data"
        })

    }
    next();
}

//ROUT HANDLERS
const getAllMovies=(req,res,next)=>{  //first parameter will be path
    /**
     * 
     * rootDir will be from drive/express
     */

    res.status(200).json({
        status: "success",
        count:list.length,
        created: req.requestedAt,
        data:{
            list:list    //enveloping
        }
    })
    // res.status(200).sendFile(path.join(roootDir,'views','shop.html')) 
    
}

const getSingleMovie=(req,res)=>{
    const id = req.params.id * 1; //converting to  number
    const movie = list.find((ele)=> ele.id ==id); //finding the object with same id
 
    // if(!movie){
    //  return res.status(404).json({
    //      status:"failed",
    //      message: `Movie with ID ${id} is not found`
    //  })
    // }
    res.status(200).json({
     status:"success",
     data:{
         list:movie
     }
    })
 
 }

 const createMovie =(res,req,next)=>{
    const newId = list[list.length-1].id //getting id of last object
    const newMoview = Object.assign({id:newId+1}, req.body) //will merge this two objects into single one

    list.push(newMoview) //adding new moview to movie object
    fs.writeFile('./data/data.json', JSON.stringify(list),()=>{ //writing json file with new object
          
        res.status(201).json({
            status:"success",
            data:{
                list:list
            }
        })
    })


}

const updateMovie =(req,res)=>{
    const id = req.params.id * 1; //converting to  number
   const movieToUpdate = list.find((ele)=> ele.id ==id); //finding the object with same id

   if(!movieToUpdate){
    return res.status(404).json({
        status:"failed",
        message: `Movie with ID ${id} is not found`
    })
   }
   let index = list.indexOf(movieToUpdate);
   Object.assign(movieToUpdate,req.body)// will merge old object with modified data
   list[index] = movieToUpdate; // replacing the new object

   //writing updated object to json file
   fs.writeFile('./data/data/json',JSON.stringify(list),()=>{
    res.status(200).json({
        status:"success",
        data:{
            movie:movieToUpdate
        }

    })
   })
}

const DeleteMovie = (req,res)=>{
    const id = req.params.id * 1; //converting to  number
    const movieToDelete = list.find((ele)=> ele.id ==id); //finding the object with same id
 
    if(!movieToDelete){
     return res.status(404).json({
         status:"failed",
         message: `Movie with ID ${id} is not found`
     })
    }
    let index = list.indexOf(movieToDelete);
    list.splice(index,1) //will mutate the original list array

    //writing updated array
    fs.writeFile('./data/data.json',JSON.stringify(list),()=>{
        res.status(204).json({
            status:"success",
            data:{
                movie:null
            }
        })
    })

}

/** id - route parameer name 
 * if id was in parameter this checkId middleware is only applied to those parameters
*/
router.param('id',checkId);
// router.get('/',getAllMovies)

//using post create one obe oject to data json file
// router.post('/',createMovie)

//chaiining of middleware. validateBody will apply first
router.route('/').get(getAllMovies).post(validateBody,createMovie)
//getting unique obejct with id using routing parameters
// router.get('/:id', getSingleMovie)

//updating an single object using patch
// router.patch('/:id',updateMovie)
//delete using id
// router.delete('/:id',DeleteMovie)

router.route('/:id').get(getSingleMovie).patch(updateMovie).delete(DeleteMovie)

module.exports = router //exporting router