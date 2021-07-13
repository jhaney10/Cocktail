//for configuring routes that stand-alone eg dashboard, home, etc
const fs = require('fs')
const express = require('express')
const router = express.Router()

const Cocktail = require('../models/Cocktail')
//import auth middleware
const {ensureAuth} = require('../middleware/auth');
const { request } = require('express');

//Allow file uploads
const multer = require('multer')
const upload = multer({ dest: 'uploads/'})
const {uploadFile, deleteFile} = require('../helpers/aws')

//@desc Show add page
//@route GET /cocktails/add

router.get('/add',ensureAuth, (req, res) => {
    res.render('cocktails/add');
})

//@desc Process Add form
//@route POST /cocktails


router.post('/',ensureAuth,upload.single('drinkThumbId'), async (req, res) => {
    try {
        // req.file is the `drinkThumbId` file
        req.body.user = req.user.id
        const file = req.file
        console.log(req.file);

        const fileResult = await uploadFile(file)
        console.log(fileResult);
        const newCocktail = new Cocktail({
            user : req.user.id,
            drinkName : req.body.drinkName,
            instructions : req.body.instructions,
            status : req.body.status,
            drinkThumbId : fileResult.Key,
            content : req.body.content,
        })
        
       // console.log(req.body.content)
        
        await Cocktail.create(newCocktail)
        //delete file after upload
        await deleteFile(file.path)

        res.redirect('/dashboard');
    }
    catch(err){
        console.error(err);
        res.render('error/500')
    }
})


module.exports = router