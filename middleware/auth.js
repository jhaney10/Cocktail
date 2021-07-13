//middleware to restrict access
module.exports = {
    ensureAuth: (req, res, next) => {
        if(req.isAuthenticated()){
            return next(); //allow access
        }
        else{
            res.redirect('/');
        }
    },
    ensureGuest: (req, res, next) => {
        if(req.isAuthenticated()){
             res.redirect('/explore'); //allow access
        }
        else{
            return next();
        }
    }
}