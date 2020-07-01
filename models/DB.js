const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (!err) {
        console.log('Mongo DB connected'); 
    }
    else {
        console.log('error occured in connecting : '  + JSON.stringify(err, undefined, 2));
    }
});

require('./user.model');