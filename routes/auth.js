//for configuring routes that stand-alone eg dashboard, home, etc

const express = require('express');
const passport = require('passport');
const router = express.Router()

//@desc Google auth
//@route GET /auth/google

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));


//@desc Google auth callback
//@route GET /auth/google/callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) =>  {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });



module.exports = router