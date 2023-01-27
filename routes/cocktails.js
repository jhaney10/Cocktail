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
//@desc Show details page
//@route GET /cocktails/2

router.get('/:id',ensureAuth, async (req, res) => {
    try {
        const id = req.params.id
        const cocktail = await Cocktail.findById(id).lean()

        if(!cocktail){
            return res.render('error/404')
        }
        // if(cocktail.status != status.public){
        //     res.redirect('/cocktails')
        // }
        console.log(cocktail);
        res.render('cocktails/details', {cocktail});
    } catch (error) {
        onsole.error(error)
        res.render('error/500')
    }
    
})

//@desc Show edit page
//@route GET /cocktails/edit/2

router.get('/edit/:id',ensureAuth, async (req, res) => {
    try {
        const id = req.params.id
        const cocktail = await Cocktail.findById(id).lean()

        if(!cocktail){
            return res.render('error/404')
        }
        
        if(cocktail.user != req.user.id){
            res.redirect('/cocktails')
        } else {
            console.log(cocktail);
            res.render('cocktails/edit', {cocktail});
        }
        // if(cocktail.status != status.public){
        //     res.redirect('/cocktails')
        // }
        
    } catch (error) {
        onsole.error(error)
        res.render('error/500')
    }
})
//@desc Process Update cocktails
//@route PUT /cocktails/:id


router.put('/:id',ensureAuth,upload.single('drinkThumbId'), async (req, res) => {
    try {
        console.log(req.body.content)
        const id = req.params.id
        let cocktail = await Cocktail.findById(id).lean()

        if(!cocktail){
            return res.render('error/404')
        }
        if(cocktail.user != req.user.id){
            res.redirect('/cocktails')
        } else {

            const file = req.file 
            if(file == null){
                req.body.drinkThumbId = cocktail.drinkThumbId
            }
            else{
                const fileResult = await uploadFile(file)
                req.body.drinkThumbId = fileResult.Key
            }
            if(req.content == null){
                req.content = cocktail.content
            }
            cocktail = await Cocktail.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            }) 

            if (file != null) { 
                //delete file after upload
                await deleteFile(file.path)
            }
            res.redirect("/dashboard")
        }
      
    }
    catch(err){
        console.error(err);
        res.render('error/500')
    }
})
module.exports = router