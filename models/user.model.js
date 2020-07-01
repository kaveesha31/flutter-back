const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : 'First name cannot be empty'
    },
    lastName : {
        type : String,
        required : 'Last name cannot be empty'
    },
    username : {
        type : String,
        required : 'Username cannot be empty'
    },
    email : {
        type : String,
        required : 'Email cannot be empty',
        unique : true
    },
    password : {
        type : String,
        required : 'Password cannot be empty',
        minlength : [6, 'Password should have atleast 6 characters']
    },
    saltSecret : {
        type : String
    }
});

//custom validations
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

//pre event to generate secrate code 
userSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        this.saltSecret = salt;
        next();
          });
    });
});

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('User', userSchema);