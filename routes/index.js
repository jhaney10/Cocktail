//for configuring routes that stand-alone eg dashboard, home, etc

const express = require('express')
const router = express.Router()

const Cocktail = require('../models/Cocktail')
//import auth middleware
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const {getFileStream} = require('../helpers/aws')
//@desc Login/Landing page
//@route GET /

router.get('/',ensureGuest, (req, res) => {

    //res.send('Login')
    res.render('login', {layout: 'login'});
})

//@desc Dashboard
//@route GET /dashboard

router.get('/dashboard',ensureAuth, async (req, res) => {
    //console.log(req.user);
    //res.send('Dashboard')
    try {
        const cocktails = await Cocktail.find({user: req.user.id}).lean() //This retrieves plain javascript objects for use in a template
        res.render('dashboard', {
            name: req.user.firstName,
            cocktails
        });
    
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    
})

//@desc Explore Cocktails
//@route GET /explore

router.get('/explore',ensureAuth, async (req, res) => {
    try {
        const cocktails = await Cocktail.find({status: 'public'})
        .populate('user') //includes user details
        .sort({createdAt: 'desc'})
        .lean() //This retrieves plain javascript objects for use in a template
        console.log(cocktails);
        res.render('explore', {
            name: req.user.firstName,
            cocktails
        });
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    
})
//@desc Retrieve Image from S3
//@route GET /images/key
router.get('/images/:key', async (req, res) => {
    const key = req.params.key
    const readStream = await getFileStream(key)

    readStream.pipe(res);
    console.log(key);
})


module.exports = router