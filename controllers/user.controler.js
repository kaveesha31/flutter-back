const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User');

module.exports.register = (req,res,next) => {
    
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if(!err)   
        res.send(doc);
        else 
        {
            if(err.code = 11000)
            res.status(422).send(['This email has already taken']);
            else 
            return next(err);
            // console.log(err);
            // console.log(doc);
            // console.log('saved to database'); 
        }   
    });
}

module.exports.authenticate = (req, res, next) => {
    console.log('hiiiiiiiii');
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    console.log('in user profile')
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['firstName','lastName','username','email']) });
        }
    );
}

module.exports.datas = function(req, res) {
    console.log('hello');
    var str = req.get('Authorization');
    try {
      jwt.verify(str, KEY, {algorithm: 'HS256'});
      res.send("Very Secret Data");
    } catch {
      res.status(401);
      res.send("Bad Token");
    }
  
  }